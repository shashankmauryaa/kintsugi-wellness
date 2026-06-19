import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { auth, db } from "@/lib/firebase-admin";
import PortalDashboard from "./PortalDashboard";

export default async function ClientPortal() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  
  if (!session) {
    redirect("/login?redirect=/portal");
  }

  let userRecord;
  let profileData;
  let bookings: any[] = [];
  try {
    const decodedToken = await auth.verifySessionCookie(session, true);
    userRecord = await auth.getUser(decodedToken.uid);
    const profileDoc = await db.collection("clientProfiles").doc(decodedToken.uid).get();
    let rawProfileData = profileDoc.data();
    if (rawProfileData) {
      profileData = JSON.parse(JSON.stringify(rawProfileData));
    }
    
    // Fetch bookings
    const bookingsSnapshot = await db.collection("bookings")
      .where("userId", "==", decodedToken.uid)
      .get();
      
    const now = new Date();
    bookingsSnapshot.forEach((doc: any) => {
      const data = doc.data();
      const booking = { 
        id: doc.id, 
        ...data, 
        startTime: data.startTime.toDate(), 
        endTime: data.endTime.toDate(),
        createdAt: data.createdAt?.toDate().toISOString() || null,
        updatedAt: data.updatedAt?.toDate().toISOString() || null
      };
      bookings.push(booking);
    });
  } catch (error: any) {
    console.error("Portal Error:", error);
    // Instead of redirecting immediately, let's display the error so we know what's breaking on Vercel
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 w-full text-center">
        <div className="bg-red-50 p-6 rounded-2xl max-w-2xl border border-red-200">
          <h2 className="text-xl font-heading text-red-700 mb-4">Debugging Vercel Error</h2>
          <p className="text-red-600 mb-4 text-sm font-mono text-left bg-white p-4 rounded border border-red-100 overflow-x-auto">
            {error?.message || String(error)}
          </p>
          <p className="text-red-500 text-sm">
            If this says "Cannot read properties of null", it means your Firebase Environment Variables in Vercel are missing, formatted incorrectly, or have an invalid Private Key.
          </p>
          <a href="/login" className="mt-6 inline-block px-6 py-2 bg-red-600 text-white rounded-full text-sm font-medium">Return to Login</a>
        </div>
      </div>
    );
  }

  return (
    <PortalDashboard initialBookings={bookings} profileData={profileData} />
  );
}
