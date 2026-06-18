import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { auth, db } from "@/lib/firebase-admin";
import BookingFlow from "./BookingFlow";
import { Suspense } from "react";

export default async function BookSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  
  if (!session) {
    redirect("/login?redirect=/book");
  }

  let uid: string = "";
  let profileData: any = null;
  let profileDoc: any = null;

  try {
    const decodedToken = await auth.verifySessionCookie(session, true);
    uid = decodedToken.uid;
    
    // Check for active consent
    profileDoc = await db.collection("clientProfiles").doc(uid).get();
    profileData = profileDoc.data();
  } catch (error: any) {
    console.error("Booking Init Error:", error);
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 w-full text-center">
        <div className="bg-red-50 p-6 rounded-2xl max-w-2xl border border-red-200">
          <h2 className="text-xl font-heading text-red-700 mb-4">Debugging Vercel Error</h2>
          <p className="text-red-600 mb-4 text-sm font-mono text-left bg-white p-4 rounded border border-red-100 overflow-x-auto">
            {error?.message || String(error)}
          </p>
          <p className="text-red-500 text-sm">
            If this says "Cannot read properties of null", your Vercel Environment Variables are missing or incorrect.
          </p>
          <a href="/login" className="mt-6 inline-block px-6 py-2 bg-red-600 text-white rounded-full text-sm font-medium">Return to Login</a>
        </div>
      </div>
    );
  }

  if (!profileDoc?.exists || !profileData?.hasActiveConsent) {
    redirect("/consent-form");
  }

  return (
    <div className="flex-1 flex flex-col items-center py-20 px-4">
      <div className="w-full max-w-4xl bg-white p-12 rounded-3xl shadow-sm border border-[var(--color-gold-200)]">
        <h1 className="text-3xl md:text-4xl font-heading text-[var(--color-gold-900)] mb-4">Book a Session</h1>
        <p className="text-[var(--color-gold-700)] mb-12">
          Select a service and choose an available time slot.
        </p>
        
        <Suspense fallback={<div className="p-12 text-center text-[var(--color-gold-600)]">Loading booking calendar...</div>}>
          <BookingFlow />
        </Suspense>
      </div>
    </div>
  );
}
