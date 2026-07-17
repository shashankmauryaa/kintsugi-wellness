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
  let shouldRedirect = false;

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
    shouldRedirect = true;
  }

  if (shouldRedirect) {
    redirect("/login?redirect=/portal");
  }

  return (
    <PortalDashboard initialBookings={bookings} profileData={profileData} />
  );
}
