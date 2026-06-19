import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { auth, db } from "@/lib/firebase-admin";
import Link from "next/link";
import { FileText, Calendar, Clock, LogOut } from "lucide-react";
import { removeSession } from "@/actions/auth";
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
    <div className="flex-1 flex w-full bg-[var(--color-surface-200)] min-h-[calc(100vh-88px)] relative">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[var(--color-gold-200)] hidden md:flex flex-col sticky top-[88px] h-[calc(100vh-88px)]">
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
      <main className="flex-1 p-8 md:p-12 relative z-10 w-full">
        <PortalDashboard initialBookings={bookings} profileData={profileData} />
      </main>
    </div>
  );
}
