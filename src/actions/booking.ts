"use server";

import { cookies } from "next/headers";
import { auth, db } from "@/lib/firebase-admin";
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
      startTime: new Date(bookingDetails.startTime),
      endTime: new Date(new Date(bookingDetails.startTime).getTime() + 50 * 60000), // 50 mins
      status: "CONFIRMED",
      googleCalendarEventId: null, // Would be populated if we create GCal event here
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
