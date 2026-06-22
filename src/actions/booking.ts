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
      if (!paymentData.razorpay_payment_link_id) {
        return { success: false, error: "Invalid payment callback" };
      }

      const Razorpay = require('razorpay');
      const instance = new Razorpay({
        key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        key_secret: process.env.RAZORPAY_KEY_SECRET!,
      });

      // Instead of fragile signature math, securely fetch the official link status
      const link = await instance.paymentLink.fetch(paymentData.razorpay_payment_link_id);
      
      if (link.status !== 'paid') {
        return { success: false, error: "Payment was not completed." };
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
    let googleCalendarRewindEventId = null;
    try {
      const calendarId = process.env.GOOGLE_CALENDAR_ID;
      const clientId = process.env.GOOGLE_CLIENT_ID;
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
      const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
      
      if (calendarId && clientId && clientSecret && refreshToken) {
        const oauth2Client = new google.auth.OAuth2(
          clientId,
          clientSecret,
          "https://developers.google.com/oauthplayground"
        );

        oauth2Client.setCredentials({
          refresh_token: refreshToken
        });

        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
        
        let serviceName = "Therapy Session";
        if (bookingDetails.serviceId === "individual") serviceName = "Individual Counselling";
        if (bookingDetails.serviceId === "student") serviceName = "Student Counselling";
        if (bookingDetails.serviceId === "listening") serviceName = "Listening Space Session";

        const eventPayload: any = {
          summary: serviceName,
          description: `Thank you for booking a session. I look forward to meeting with you.\n\nI hope to offer a space that feels thoughtful, supportive, and open to whatever you may be bringing with you. Sessions are approximately 50-60 minutes long. You'll receive further details once your booking is confirmed.\n\nIf you need to cancel or reschedule, please try to let me know at least a day in advance. Of course, I understand that unexpected emergencies can arise, and we can work around those situations as needed.\n`,
          start: {
            dateTime: startTime.toISOString(),
          },
          end: {
            dateTime: endTime.toISOString(),
          },
          attendees: [
            { email: userEmail }
          ],
        };

        if (bookingDetails.mode === "offline") {
          let locString = "Christ University, Bengaluru";
          if (bookingDetails.offlineLocation === "clinic") locString = "At a Clinic";
          if (bookingDetails.offlineLocation === "discuss") locString = "To be discussed personally";
          eventPayload.location = locString;
        } else {
          eventPayload.conferenceData = {
            createRequest: {
              requestId: crypto.randomBytes(10).toString('hex'),
              conferenceSolutionKey: { type: 'hangoutsMeet' }
            }
          };
        }

        // 1. Create the Main Therapy Session
        const event = await calendar.events.insert({
          calendarId: calendarId,
          sendUpdates: 'all', // Send invite to client
          conferenceDataVersion: bookingDetails.mode === "offline" ? 0 : 1, 
          requestBody: eventPayload
        });

        googleCalendarEventId = event.data.id;
        googleMeetLink = event.data.hangoutLink || null;

        // 2. Create the Rewind Time Block if configured
        if (REWIND_TIME_MINUTES > 0) {
          const rewindEvent = await calendar.events.insert({
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
          googleCalendarRewindEventId = rewindEvent.data.id || null;
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
      googleCalendarRewindEventId: googleCalendarRewindEventId,
      googleMeetLink: googleMeetLink,
      mode: bookingDetails.mode || "online",
      offlineLocation: bookingDetails.offlineLocation || null,
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

export async function rescheduleBooking(bookingId: string, newStartTimeStr: string) {
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

    const bookingData = bookingDoc.data();
    if (bookingData?.userId !== uid) {
      return { success: false, error: "Unauthorized access to booking" };
    }

    const oldStartTime = bookingData.startTime.toDate();
    const now = new Date();
    
    // Enforce 24-hour rule
    const hoursUntilSession = (oldStartTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    if (hoursUntilSession < 24) {
      return { success: false, error: "Sessions can only be rescheduled up to 24 hours in advance." };
    }

    // Calculate new times
    const durationMins = (bookingData.endTime.toMillis() - bookingData.startTime.toMillis()) / 60000;
    const newStartTime = new Date(newStartTimeStr);
    const newEndTime = new Date(newStartTime.getTime() + durationMins * 60000);
    
    const REWIND_TIME_MINUTES = 30; // Hardcoded matching the create booking logic
    const newRewindEndTime = new Date(newEndTime.getTime() + REWIND_TIME_MINUTES * 60000);

    // Update Google Calendar
    const calendarId = process.env.GOOGLE_CALENDAR_ID;
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

    if (calendarId && clientId && clientSecret && refreshToken && bookingData.googleCalendarEventId) {
      const { google } = require('googleapis');
      const oauth2Client = new google.auth.OAuth2(
        clientId, clientSecret, "https://developers.google.com/oauthplayground"
      );
      oauth2Client.setCredentials({ refresh_token: refreshToken });
      const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

      // Patch Main Event
      await calendar.events.patch({
        calendarId: calendarId,
        eventId: bookingData.googleCalendarEventId,
        sendUpdates: 'all',
        requestBody: {
          start: { dateTime: newStartTime.toISOString() },
          end: { dateTime: newEndTime.toISOString() }
        }
      });

      // Patch or Handle Rewind Event
      if (bookingData.googleCalendarRewindEventId) {
        await calendar.events.patch({
          calendarId: calendarId,
          eventId: bookingData.googleCalendarRewindEventId,
          requestBody: {
            start: { dateTime: newEndTime.toISOString() },
            end: { dateTime: newRewindEndTime.toISOString() }
          }
        }).catch((err: any) => console.error("Failed to patch rewind event", err));
      } else {
        // Fallback for older bookings: Search for it and update/delete
        const res = await calendar.events.list({
          calendarId: calendarId,
          timeMin: bookingData.endTime.toDate().toISOString(),
          timeMax: new Date(bookingData.endTime.toMillis() + REWIND_TIME_MINUTES * 60000 + 5000).toISOString(),
          q: "Rewind Time"
        });
        if (res.data.items && res.data.items.length > 0) {
          const oldRewind = res.data.items[0];
          await calendar.events.patch({
            calendarId: calendarId,
            eventId: oldRewind.id as string,
            requestBody: {
              start: { dateTime: newEndTime.toISOString() },
              end: { dateTime: newRewindEndTime.toISOString() }
            }
          });
          // Update firestore with the found ID for future
          await bookingRef.update({ googleCalendarRewindEventId: oldRewind.id });
        }
      }
    }

    // Update Firestore
    await bookingRef.update({
      startTime: newStartTime,
      endTime: newEndTime,
      updatedAt: new Date()
    });

    return { success: true };
  } catch (error: any) {
    console.error("Reschedule error:", error);
    return { success: false, error: error.message || "Failed to reschedule session" };
  }
}
