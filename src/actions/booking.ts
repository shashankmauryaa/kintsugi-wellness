"use server";

import { cookies } from "next/headers";
import { auth, db } from "@/lib/firebase-admin";
import { google } from "googleapis";
import crypto from "crypto";

export async function verifyAndCreateBooking(paymentData: any, bookingDetails: any) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const decodedToken = await auth.verifySessionCookie(session, true);
    const uid = decodedToken.uid;
    const userDoc = await db.collection("users").doc(uid).get();
    const userName = userDoc.exists ? userDoc.data()?.displayName || "Client" : "Client";
    const userEmail = decodedToken.email || (userDoc.exists ? userDoc.data()?.email : "");

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, isMock } = paymentData;

    if (!isMock) {
      // Verify signature
      const secret = process.env.RAZORPAY_KEY_SECRET;
      if (!secret) throw new Error("Razorpay secret not configured");

      const generatedSignature = crypto
        .createHmac("sha256", secret)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest("hex");

      if (generatedSignature !== razorpay_signature) {
        return { success: false, error: "Payment verification failed" };
      }
    }

    // ================================================================================
    // 🕒 REWIND / BUFFER TIME CONFIGURATION
    // This is the number of minutes automatically booked AFTER every session.
    // Ensure this matches the REWIND_TIME_MINUTES in src/app/api/calendar/route.ts!
    // ================================================================================
    const REWIND_TIME_MINUTES = 30;

    // Dynamic duration from frontend (default 60 if not provided)
    const durationMins = bookingDetails.duration || 60;
    const startTime = new Date(bookingDetails.startTime);
    const endTime = new Date(startTime.getTime() + durationMins * 60000);
    const rewindEndTime = new Date(endTime.getTime() + REWIND_TIME_MINUTES * 60000);

    // Create Google Calendar Event
    let googleCalendarEventId = null;
    let googleMeetLink = null;
    try {
      const calendarId = process.env.GOOGLE_CALENDAR_ID;
      const credentials = process.env.GOOGLE_CALENDAR_CREDENTIALS_JSON;
      
      if (calendarId && credentials) {
        const gAuth = new google.auth.GoogleAuth({
          credentials: JSON.parse(credentials),
          scopes: ['https://www.googleapis.com/auth/calendar.events'],
        });

        const calendar = google.calendar({ version: 'v3', auth: gAuth });
        
        let serviceName = "Therapy Session";
        if (bookingDetails.serviceId === "individual") serviceName = "Individual Counselling";
        if (bookingDetails.serviceId === "student") serviceName = "Student Counselling";
        if (bookingDetails.serviceId === "listening") serviceName = "Listening Space Session";

        // 1. Create the Main Therapy Session
        const event = await calendar.events.insert({
          calendarId: calendarId,
          requestBody: {
            summary: `${serviceName} (${userName})`,
            description: `Automated booking for ${userName}.\nService: ${serviceName}`,
            location: 'https://meet.google.com/zus-tnas-agy', // Static Personal Meeting Room
            start: {
              dateTime: startTime.toISOString(),
            },
            end: {
              dateTime: endTime.toISOString(),
            }
          }
        });

        googleCalendarEventId = event.data.id;
        // Hardcode the static link so it appears on the client dashboard
        googleMeetLink = 'https://meet.google.com/zus-tnas-agy';

        // 2. Create the Rewind Time Block if configured
        if (REWIND_TIME_MINUTES > 0) {
          await calendar.events.insert({
            calendarId: calendarId,
            requestBody: {
              summary: `Rewind Time`,
              description: `Automated buffer time booked after session with ${userName}.`,
              start: {
                dateTime: endTime.toISOString(),
              },
              end: {
                dateTime: rewindEndTime.toISOString(),
              },
              // Dark grey color to indicate blocked time (colorId '8')
              colorId: '8' 
            }
          });
        }
      }
    } catch (gcalError) {
      console.error("Failed to create Google Calendar event:", gcalError);
      // We don't fail the whole booking if GCal fails, but we log it
    }

    // 1. Create Booking in Firestore
    const bookingRef = db.collection("bookings").doc();
    
    // Fetch consent forms for this user
    const consentDocs = await db.collection("consentForms")
      .where("userId", "==", uid)
      .get();
      
    let consentFormId = "pending";
    if (!consentDocs.empty) {
      // Sort in memory to avoid needing a Firestore composite index
      const docs = consentDocs.docs.sort((a: any, b: any) => {
        return b.data().consentedAt.toMillis() - a.data().consentedAt.toMillis();
      });
      consentFormId = docs[0].id;
    }

    const bookingPayload = {
      id: bookingRef.id,
      userId: uid,
      serviceId: bookingDetails.serviceId,
      consentFormId: consentFormId,
      startTime: startTime,
      endTime: endTime,
      status: "CONFIRMED",
      googleCalendarEventId: googleCalendarEventId,
      googleMeetLink: googleMeetLink,
      createdAt: new Date(),
    };

    await bookingRef.set(bookingPayload);

    // 2. Create Payment Record in Firestore
    const paymentRef = db.collection("payments").doc();
    await paymentRef.set({
      id: paymentRef.id,
      bookingId: bookingRef.id,
      amount: bookingDetails.amount,
      currency: "INR",
      provider: "RAZORPAY",
      providerOrderId: razorpay_order_id || "mock_order",
      providerPaymentId: razorpay_payment_id || "mock_payment",
      status: "SUCCESS",
      createdAt: new Date()
    });

    return { success: true, bookingId: bookingRef.id };
  } catch (error: any) {
    console.error("Booking verification error:", error);
    return { success: false, error: error.message || "Failed to process booking" };
  }
}

export async function saveSessionNote(bookingId: string, note: string) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const decodedToken = await auth.verifySessionCookie(session, true);
    const uid = decodedToken.uid;

    const bookingRef = db.collection("bookings").doc(bookingId);
    const bookingDoc = await bookingRef.get();

    if (!bookingDoc.exists) {
      return { success: false, error: "Booking not found" };
    }

    if (bookingDoc.data()?.userId !== uid) {
      return { success: false, error: "Unauthorized access to booking" };
    }

    await bookingRef.update({
      note: note,
      updatedAt: new Date()
    });

    return { success: true };
  } catch (error: any) {
    console.error("Save note error:", error);
    return { success: false, error: error.message || "Failed to save note" };
  }
}
