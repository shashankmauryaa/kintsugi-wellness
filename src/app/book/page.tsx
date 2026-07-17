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
    redirect("/login?redirect=/book");
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
