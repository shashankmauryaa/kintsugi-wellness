import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/firebase-admin";
import Link from "next/link";
import { FileText, Calendar, Clock, User } from "lucide-react";
import LogoutButton from "@/components/LogoutButton";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  
  if (!session) {
    redirect("/login?redirect=/clients");
  }

  let userRecord;
  let shouldRedirect = false;
  try {
    const decodedToken = await auth.verifySessionCookie(session, true);
    userRecord = await auth.getUser(decodedToken.uid);
  } catch (error) {
    console.error("Portal Layout Error:", error);
    shouldRedirect = true;
  }

  if (shouldRedirect) {
    redirect("/login?clear_session=1&redirect=/clients");
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
          <Link href="/clients" className="flex items-center gap-3 px-4 py-3 text-[var(--color-gold-800)] hover:bg-[var(--color-gold-50)] rounded-xl font-medium transition-colors">
            <Calendar size={20} /> Dashboard
          </Link>
          <Link href="/book" className="flex items-center gap-3 px-4 py-3 text-[var(--color-gold-800)] hover:bg-[var(--color-gold-50)] rounded-xl font-medium transition-colors">
            <Clock size={20} /> Book Session
          </Link>
          <Link href="/clients/my-info" className="flex items-center gap-3 px-4 py-3 text-[var(--color-gold-800)] hover:bg-[var(--color-gold-50)] rounded-xl font-medium transition-colors">
            <User size={20} /> My Info
          </Link>
        </nav>
        <div className="p-4 border-t border-[var(--color-gold-100)]">
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 md:p-12 relative z-10 w-full">
        {children}
      </main>
    </div>
  );
}
