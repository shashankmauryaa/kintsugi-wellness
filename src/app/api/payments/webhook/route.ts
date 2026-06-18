import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/firebase-admin';
import { google } from 'googleapis';

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature');
    const secret = process.env.RAZORPAY_KEY_SECRET;

    if (!secret || !signature) {
      return NextResponse.json({ error: 'Missing configuration or signature' }, { status: 400 });
    }

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;

    if (event === 'payment.captured' || event === 'payment.authorized') {
      const paymentData = payload.payload.payment.entity;
      const { userId, serviceId, startTime } = paymentData.notes;
      const orderId = paymentData.order_id;
      
      // Update Payment Record
      const paymentsSnapshot = await db.collection("payments").where("providerOrderId", "==", orderId).get();
      if (!paymentsSnapshot.empty) {
        const paymentDoc = paymentsSnapshot.docs[0];
        await paymentDoc.ref.update({
          status: "SUCCESS",
          providerPaymentId: paymentData.id,
        });

        // Update Booking Record
        const bookingId = paymentDoc.data().bookingId;
        const bookingRef = db.collection("bookings").doc(bookingId);
        await bookingRef.update({ status: "CONFIRMED" });

        // Generate Google Calendar Event
        await createGoogleCalendarEvent(userId, serviceId, startTime, bookingId);
      }
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error: any) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

async function createGoogleCalendarEvent(userId: string, serviceId: string, startTime: string, bookingId: string) {
  if (!process.env.GOOGLE_CALENDAR_ID || !process.env.GOOGLE_CALENDAR_CREDENTIALS_JSON) return;

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_CALENDAR_CREDENTIALS_JSON),
      scopes: ['https://www.googleapis.com/auth/calendar.events'],
    });

    const calendar = google.calendar({ version: 'v3', auth });
    
    const start = new Date(startTime);
    const end = new Date(start.getTime() + 50 * 60000); // 50 mins

    const userDoc = await db.collection("users").doc(userId).get();
    const clientEmail = userDoc.data()?.email || "Client";

    const event = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      requestBody: {
        summary: `Therapy Session: ${serviceId}`,
        description: `Booking ID: ${bookingId}`,
        start: { dateTime: start.toISOString() },
        end: { dateTime: end.toISOString() },
        attendees: [{ email: clientEmail }],
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 },
            { method: 'popup', minutes: 60 },
          ],
        },
      },
    });

    // Save event ID to booking
    await db.collection("bookings").doc(bookingId).update({
      googleCalendarEventId: event.data.id,
    });
  } catch (error) {
    console.error("Failed to create calendar event:", error);
  }
}
