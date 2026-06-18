import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { auth, db } from "@/lib/firebase-admin";
import Link from "next/link";
import { FileText, Calendar, Clock, LogOut } from "lucide-react";
import { removeSession } from "@/actions/auth";

export default async function ClientPortal() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  
  if (!session) {
    redirect("/login?redirect=/portal");
  }

  let userRecord;
  let profileData;
  let upcomingBookings: any[] = [];
  let pastBookings: any[] = [];
  try {
    const decodedToken = await auth.verifySessionCookie(session, true);
    userRecord = await auth.getUser(decodedToken.uid);
    const profileDoc = await db.collection("clientProfiles").doc(decodedToken.uid).get();
    profileData = profileDoc.data();
    
    // Fetch bookings
    const bookingsSnapshot = await db.collection("bookings")
      .where("userId", "==", decodedToken.uid)
      .get();
      
    const now = new Date();
    bookingsSnapshot.forEach(doc => {
      const data = doc.data();
      const booking = { id: doc.id, ...data, startTime: data.startTime.toDate(), endTime: data.endTime.toDate() };
      if (booking.startTime >= now) {
        upcomingBookings.push(booking);
      } else {
        pastBookings.push(booking);
      }
    });
    // Sort upcoming bookings ascending (soonest first)
    upcomingBookings.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    // Sort past bookings descending (newest first)
    pastBookings.sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
  } catch (error) {
    redirect("/login");
  }

  return (
    <div className="flex-1 flex w-full bg-[var(--color-surface-200)]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[var(--color-gold-200)] hidden md:flex flex-col">
        <div className="p-6 border-b border-[var(--color-gold-100)]">
          <h2 className="text-xl font-heading text-[var(--color-gold-900)] truncate">{userRecord.displayName || userRecord.email}</h2>
          <p className="text-sm text-[var(--color-gold-600)]">Client Portal</p>
        </div>
        <nav className="p-4 space-y-2 flex-1">
          <Link href="/portal" className="flex items-center gap-3 px-4 py-3 bg-[var(--color-gold-50)] text-[var(--color-gold-900)] rounded-xl font-medium">
            <Calendar size={20} /> Dashboard
          </Link>
          <Link href="/book" className="flex items-center gap-3 px-4 py-3 text-[var(--color-gold-800)] hover:bg-[var(--color-gold-50)] rounded-xl font-medium transition-colors">
            <Clock size={20} /> Book Session
          </Link>
          <Link href="/consent-form" className="flex items-center gap-3 px-4 py-3 text-[var(--color-gold-800)] hover:bg-[var(--color-gold-50)] rounded-xl font-medium transition-colors">
            <FileText size={20} /> Consent Forms
          </Link>
        </nav>
        <div className="p-4 border-t border-[var(--color-gold-100)]">
          <form action={async () => {
            "use server";
            await removeSession();
            redirect("/login");
          }}>
            <button type="submit" className="flex w-full items-center gap-3 px-4 py-3 text-[var(--color-gold-800)] hover:bg-red-50 hover:text-red-600 rounded-xl font-medium transition-colors">
              <LogOut size={20} /> Log Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        <h1 className="text-3xl font-heading text-[var(--color-gold-900)] mb-8">Dashboard</h1>

        {!profileData?.hasActiveConsent && (
          <div className="mb-8 p-6 bg-yellow-50 border border-yellow-200 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-heading text-yellow-900 mb-1">Action Required: Complete Consent Form</h3>
              <p className="text-yellow-800">You must complete the mandatory consent form before you can book a session.</p>
            </div>
            <Link href="/consent-form" className="px-6 py-2 bg-yellow-600 text-white rounded-full font-medium whitespace-nowrap">
              Complete Now
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Upcoming Sessions */}
          <div className="bg-white p-6 rounded-3xl border border-[var(--color-gold-200)] shadow-sm">
            <h2 className="text-xl font-heading text-[var(--color-gold-900)] mb-4 flex items-center gap-2">
              <Calendar size={20} className="text-[var(--color-gold-500)]" /> Upcoming Sessions
            </h2>
            {upcomingBookings.length === 0 ? (
              <div className="py-8 text-center text-[var(--color-gold-600)]">
                No upcoming sessions.
              </div>
            ) : (
              <div className="space-y-4 mb-6">
                {upcomingBookings.map((session, i) => (
                  <div key={i} className="p-4 border border-[var(--color-gold-200)] rounded-2xl flex justify-between items-center bg-[var(--color-gold-50)]">
                    <div>
                      <div className="font-medium text-[var(--color-gold-900)]">
                        {session.startTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                      </div>
                      <div className="text-sm text-[var(--color-gold-700)] mt-1">
                        {session.startTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} - {session.endTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      Confirmed
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Link href="/book" className="block w-full text-center py-2 bg-[var(--color-gold-50)] text-[var(--color-gold-800)] rounded-xl font-medium hover:bg-[var(--color-gold-100)] transition-colors mt-4">
              Book a New Session
            </Link>
          </div>

          {/* Past Sessions */}
          <div className="bg-white p-6 rounded-3xl border border-[var(--color-gold-200)] shadow-sm">
            <h2 className="text-xl font-heading text-[var(--color-gold-900)] mb-4 flex items-center gap-2">
              <Clock size={20} className="text-[var(--color-gold-500)]" /> Past Sessions
            </h2>
            {pastBookings.length === 0 ? (
              <div className="py-8 text-center text-[var(--color-gold-600)]">
                No past sessions.
              </div>
            ) : (
              <div className="space-y-4">
                {pastBookings.map((session, i) => (
                  <div key={i} className="p-4 border border-[var(--color-gold-100)] rounded-2xl flex justify-between items-center opacity-70">
                    <div>
                      <div className="font-medium text-[var(--color-gold-900)]">
                        {session.startTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div className="text-sm text-[var(--color-gold-700)] mt-1">
                        {session.startTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                      </div>
                    </div>
                    <div className="text-sm text-[var(--color-gold-600)]">
                      Completed
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
