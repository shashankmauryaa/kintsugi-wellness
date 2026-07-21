import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { cookies } from 'next/headers';
import { auth } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decodedToken = await auth.verifySessionCookie(session, true);
    const userEmail = decodedToken.email || "";

    const body = await request.json();
    const { serviceId, startTime, amount, title, mode, offlineLocation, therapistId } = body;

    const isDev = process.env.NODE_ENV === 'development';
    const baseUrl = isDev ? 'http://localhost:3000' : 'https://kintsugi-wellness.vercel.app';
    
    // Check if Razorpay keys are configured
    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json({ 
        isMock: true, 
        paymentLink: `${baseUrl}/book/success?mock=true&serviceId=${serviceId}&startTime=${encodeURIComponent(startTime)}&amount=${amount}&therapistId=${therapistId || 'unknown'}`,
        message: 'Razorpay keys not configured. Redirecting to mock success page.'
      });
    }

    const instance = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // We pass our booking data safely as query parameters to the callback URL
    const callbackUrl = new URL(`${baseUrl}/book/success`);
    callbackUrl.searchParams.set('serviceId', serviceId);
    callbackUrl.searchParams.set('startTime', startTime);
    callbackUrl.searchParams.set('amount', amount.toString());
    if (mode) callbackUrl.searchParams.set('mode', mode);
    if (offlineLocation) callbackUrl.searchParams.set('offlineLocation', offlineLocation);
    if (therapistId) callbackUrl.searchParams.set('therapistId', therapistId);

    // Create the Payment Link
    const options = {
      amount: amount * 100, // amount in smallest currency unit (paise)
      currency: "INR",
      description: title || "Therapy Session",
      customer: {
        name: decodedToken.name || "Client",
        email: userEmail
      },
      notify: {
        sms: false,
        email: true
      },
      reminder_enable: false,
      callback_url: callbackUrl.toString(),
      callback_method: "get"
    };

    const paymentLink = await instance.paymentLink.create(options);
    
    return NextResponse.json({ paymentLink: paymentLink.short_url, isMock: false });
  } catch (error) {
    console.error('Razorpay Payment Link Creation Error:', error);
    return NextResponse.json({ error: 'Failed to create payment link' }, { status: 500 });
  }
}
