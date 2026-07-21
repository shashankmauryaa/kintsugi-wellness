import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { auth, db } from "@/lib/firebase-admin";
import Link from "next/link";
import { Users, ChevronRight, User } from "lucide-react";
import ClientCard from "./ClientCard";

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

export default async function TherapistClientsPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  
  if (!session) {
    redirect("/login?redirect=/therapists/clients");
  }

  let clients: any[] = [];
  let shouldRedirect = false;

  try {
    const decodedToken = await auth.verifySessionCookie(session, true);
    const therapistId = decodedToken.uid;
    
    // Fetch all bookings for this therapist
    const bookingsSnapshot = await db.collection("bookings")
      .where("therapistId", "==", therapistId)
      .get();
      
    // Extract unique client IDs from bookings
    const clientIds = new Set<string>();
    bookingsSnapshot.forEach((doc: any) => {
      const data = doc.data();
      if (data.userId) clientIds.add(data.userId);
    });

    // Fetch clients who selected this therapist in the consent form (even if they haven't booked yet)
    const profilesSnapshot = await db.collection("clientProfiles")
      .where("therapistId", "==", therapistId)
      .get();
      
    profilesSnapshot.forEach((doc: any) => {
      // doc.id is the client's uid because we use uid as document id for clientProfiles
      clientIds.add(doc.id);
    });

    // Fetch client profiles
    const clientsList = [];
    for (const clientId of Array.from(clientIds)) {
      try {
        const userDoc = await db.collection("users").doc(clientId).get();
        const profileDoc = await db.collection("clientProfiles").doc(clientId).get();
        
        let name = "Unknown Client";
        let email = "";
        
        try {
          const authUser = await auth.getUser(clientId);
          if (authUser.displayName) name = authUser.displayName;
          if (authUser.email) email = authUser.email;
        } catch (e) {}
        
        if (profileDoc.exists && profileDoc.data()?.fullName) {
          name = profileDoc.data()?.fullName;
        } else if (userDoc.exists) {
          name = userDoc.data()?.displayName || name;
          email = userDoc.data()?.email || email;
        }
        
        const rawProfile = profileDoc.exists ? profileDoc.data() : null;
        const sanitizedProfile = sanitizeData(rawProfile);
        
        clientsList.push({
          id: clientId,
          name,
          email,
          profile: sanitizedProfile
        });
      } catch (err) {
        console.error("Error fetching client details for", clientId, err);
      }
    }
    
    clients = clientsList.sort((a, b) => a.name.localeCompare(b.name));
    
  } catch (error: any) {
    console.error("Therapist Clients Page Error:", error);
    shouldRedirect = true;
  }

  if (shouldRedirect) {
    redirect("/login?clear_session=1&redirect=/therapists/clients");
  }

  return (
    <div className="flex-1 w-full bg-[var(--color-surface-200)] p-8 md:p-12 relative z-10 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-[var(--color-gold-200)]">
            <Users className="text-[var(--color-gold-600)]" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-heading text-[var(--color-gold-900)]">My Clients</h1>
            <p className="text-[var(--color-gold-700)]">Clients you have had or will have sessions with.</p>
          </div>
        </div>

        {clients.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-[var(--color-gold-200)] shadow-sm text-center">
            <Users className="w-16 h-16 text-[var(--color-gold-300)] mx-auto mb-4" />
            <h3 className="text-xl font-heading text-[var(--color-gold-900)] mb-2">No clients found</h3>
            <p className="text-[var(--color-gold-700)]">No clients have booked sessions or selected you yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.map(client => (
              <ClientCard key={client.id} client={client} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
