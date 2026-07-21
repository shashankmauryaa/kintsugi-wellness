import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { auth, db } from "@/lib/firebase-admin";
import Link from "next/link";
import { Calendar, Clock, Video } from "lucide-react";

export default async function TherapistUpcomingSessionsPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  
  if (!session) {
    redirect("/login?redirect=/therapists/sessions");
  }

  let upcomingBookings: any[] = [];
  let shouldRedirect = false;

  try {
    const decodedToken = await auth.verifySessionCookie(session, true);
    const therapistId = decodedToken.uid;
    
    // Fetch all bookings for this therapist
    const bookingsSnapshot = await db.collection("bookings")
      .where("therapistId", "==", therapistId)
      .get();
      
    const allBookings: any[] = [];
    const clientIds = new Set<string>();
    
    bookingsSnapshot.forEach((doc: any) => {
      const data = doc.data();
      allBookings.push({ id: doc.id, ...data });
      if (data.userId) clientIds.add(data.userId);
    });

    // Fetch client names to display
    const clientMap = new Map<string, string>();
    for (const clientId of Array.from(clientIds)) {
      try {
        let name = "Unknown Client";
        const userDoc = await db.collection("users").doc(clientId).get();
        const profileDoc = await db.collection("clientProfiles").doc(clientId).get();
        
        try {
          const authUser = await auth.getUser(clientId);
          if (authUser.displayName) name = authUser.displayName;
        } catch (e) {}
        
        if (profileDoc.exists && profileDoc.data()?.fullName) {
          name = profileDoc.data()?.fullName;
        } else if (userDoc.exists) {
          name = userDoc.data()?.displayName || name;
        }
        clientMap.set(clientId, name);
      } catch (err) {
        console.error("Error fetching client details for", clientId, err);
      }
    }
    
    // Filter for upcoming sessions and sort them
    const now = new Date();
    upcomingBookings = allBookings
      .filter(b => {
        // Handle both Timestamp and string dates
        const end = b.endTime?.toDate ? b.endTime.toDate() : new Date(b.endTime);
        return end > now;
      })
      .sort((a, b) => {
        const startA = a.startTime?.toDate ? a.startTime.toDate() : new Date(a.startTime);
        const startB = b.startTime?.toDate ? b.startTime.toDate() : new Date(b.startTime);
        return startA.getTime() - startB.getTime();
      })
      .map(b => ({
        ...b,
        startTime: b.startTime?.toDate ? b.startTime.toDate().toISOString() : new Date(b.startTime).toISOString(),
        endTime: b.endTime?.toDate ? b.endTime.toDate().toISOString() : new Date(b.endTime).toISOString(),
        clientName: clientMap.get(b.userId) || "Unknown Client"
      }));

  } catch (error: any) {
    console.error("Therapist Sessions Page Error:", error);
    shouldRedirect = true;
  }

  if (shouldRedirect) {
    redirect("/login?clear_session=1&redirect=/therapists/sessions");
  }

  return (
    <div className="flex-1 w-full bg-[var(--color-surface-200)] p-8 md:p-12 relative z-10 min-h-screen">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-[var(--color-gold-200)]">
            <Calendar className="text-[var(--color-gold-600)]" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-heading text-[var(--color-gold-900)]">Upcoming Sessions</h1>
            <p className="text-[var(--color-gold-700)]">View and manage all your scheduled appointments.</p>
          </div>
        </div>

        {upcomingBookings.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-[var(--color-gold-200)] shadow-sm text-center">
            <Calendar className="w-16 h-16 text-[var(--color-gold-300)] mx-auto mb-4" />
            <h3 className="text-xl font-heading text-[var(--color-gold-900)] mb-2">No upcoming sessions</h3>
            <p className="text-[var(--color-gold-700)]">You don't have any scheduled sessions at the moment.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingBookings.map((session) => (
              <div key={session.id} className="bg-white p-6 md:p-8 rounded-3xl border border-[var(--color-gold-200)] hover:border-[var(--color-gold-400)] transition-colors shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h3 className="text-xl font-medium text-[var(--color-gold-900)] mb-2">Session with {session.clientName}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-[var(--color-gold-700)]">
                    <span className="flex items-center gap-2 bg-[var(--color-gold-50)] px-3 py-1.5 rounded-full text-sm">
                      <Calendar size={16} className="text-[var(--color-gold-500)]" />
                      {new Date(session.startTime).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-2 bg-[var(--color-gold-50)] px-3 py-1.5 rounded-full text-sm">
                      <Clock size={16} className="text-[var(--color-gold-500)]" />
                      {new Date(session.startTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} - {new Date(session.endTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {session.googleMeetLink && (
                    <a 
                      href={session.googleMeetLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 rounded-full text-sm font-medium transition-colors"
                    >
                      <Video size={18} /> Join Meet
                    </a>
                  )}
                  <Link 
                    href={`/therapists/clients/${session.userId}`}
                    className="px-5 py-2.5 bg-[var(--color-gold-700)] text-white hover:bg-[var(--color-gold-800)] rounded-full text-sm font-medium transition-colors"
                  >
                    View Client
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
