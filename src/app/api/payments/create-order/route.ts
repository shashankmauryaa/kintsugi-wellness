import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { cookies } from 'next/headers';
import { auth, db } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decodedToken = await auth.verifySessionCookie(session, true);
    const uid = decodedToken.uid;

    const body = await request.json();
    const { serviceId, startTime, amount } = body;

    // In a real app, we'd verify the amount matches the serviceId from Firestore
    // const serviceDoc = await db.collection('services').doc(serviceId).get();
    // const actualAmount = serviceDoc.data()?.price;

    // Check if Razorpay keys are configured
    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json({ 
        isMock: true, 
        orderId: `mock_order_${Date.now()}`,
        message: 'Razorpay keys not configured. Returning mock order.'
      });
    }

    const instance = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: amount * 100, // amount in smallest currency unit (paise for INR)
      currency: "INR",
      receipt: `receipt_${Date.now()}_${uid.substring(0, 5)}`,
      notes: {
        userId: uid,
        serviceId: serviceId,
        startTime: startTime,
      }
    };

    const order = await instance.orders.create(options);
    
    return NextResponse.json({ orderId: order.id, isMock: false });
  } catch (error) {
    console.error('Razorpay Order Creation Error:', error);
    return NextResponse.json({ error: 'Failed to create payment order' }, { status: 500 });
  }
}
