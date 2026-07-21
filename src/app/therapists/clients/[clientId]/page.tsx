import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { auth, db } from "@/lib/firebase-admin";
import TherapistClientDashboard from "./TherapistClientDashboard";

function sanitizeData(data: any): any {
  if (data === null || data === undefined) return data;
  if (typeof data?.toDate === 'function') return data.toDate().toISOString();
  if (Array.isArray(data)) return data.map(sanitizeData);
  if (typeof data === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(data)) {
      sanitized[key] = sanitizeData(value);
    }
    return sanitized;
  }
  return data;
}

export default async function TherapistClientPage({ params }: { params: { clientId: string } }) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  
  if (!session) {
    redirect("/login?redirect=/therapists/clients");
  }

  let userRecord;
  let clientProfile;
  const bookings: any[] = [];
  let shouldRedirect = false;

  try {
    const { clientId } = await Promise.resolve(params);
    const decodedToken = await auth.verifySessionCookie(session, true);
    const therapistId = decodedToken.uid;
    
    // Fetch client user details
    const userDoc = await db.collection("users").doc(clientId).get();
    const profileDoc = await db.collection("clientProfiles").doc(clientId).get();
    
    let name = "Unknown Client";
    let email = "";
    
    try {
      const authUser = await auth.getUser(clientId);
      if (authUser.displayName) name = authUser.displayName;
      if (authUser.email) email = authUser.email;
    } catch (e) {
      console.log("Could not fetch auth user", e);
    }
    
    if (profileDoc.exists && profileDoc.data()?.fullName) {
      name = profileDoc.data()?.fullName;
    } else if (userDoc.exists) {
      name = userDoc.data()?.displayName || name;
      email = userDoc.data()?.email || email;
    }
    
    const rawProfile = profileDoc.exists ? profileDoc.data() : {};
    
    // Sanitize any Date/Timestamp objects from rawProfile to avoid Next.js serialization errors
    const sanitizedProfile = sanitizeData(rawProfile);

    clientProfile = {
      id: clientId,
      name,
      email,
      ...sanitizedProfile
    };
    
    // Fetch bookings for THIS specific client and THIS therapist
    const bookingsSnapshot = await db.collection("bookings")
      .where("therapistId", "==", therapistId)
      .where("userId", "==", clientId)
      .get();
      
    bookingsSnapshot.forEach((doc: any) => {
      const data = doc.data();
      const booking = sanitizeData({ 
        id: doc.id, 
        ...data
      });
      bookings.push(booking);
    });
    
    // Sort bookings descending
    bookings.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
    
  } catch (error: any) {
    console.error("Therapist Client Page Error:", error);
    shouldRedirect = true;
  }

  if (shouldRedirect) {
    redirect("/therapists/clients");
  }

  return (
    <TherapistClientDashboard client={clientProfile} initialBookings={bookings} />
  );
}
