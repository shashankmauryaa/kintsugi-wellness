import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { auth, db } from "@/lib/firebase-admin";
import ConsentFormFlow from "./ConsentFormFlow";

export default async function ConsentFormPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  
  if (!session) {
    redirect("/login?redirect=/consent-form");
  }

  let shouldRedirect = false;
  let hasConsent = false;
  const therapists: any[] = [];

  try {
    const decodedToken = await auth.verifySessionCookie(session, true);
    
    // Check if they already have consent
    const profileDoc = await db.collection("clientProfiles").doc(decodedToken.uid).get();
    if (profileDoc.exists && profileDoc.data()?.hasActiveConsent) {
      hasConsent = true;
    }
    
    if (!hasConsent) {
      // Fetch all therapists
      const snapshot = await db.collection("therapist_profiles").get();
      snapshot.forEach((doc: any) => {
        const data = doc.data();
        therapists.push({
          id: doc.id,
          name: data.name,
          title: data.title || "Therapist"
        });
      });
      // Sort alphabetically
      therapists.sort((a, b) => a.name.localeCompare(b.name));
    }
    
  } catch (error) {
    console.error("Consent Form Auth Error:", error);
    shouldRedirect = true;
  }

  if (shouldRedirect) {
    redirect("/login?clear_session=1&redirect=/consent-form");
  }

  if (hasConsent) {
    redirect("/clients");
  }

  return (
    <div className="flex-1 flex flex-col pt-12 md:pt-20 px-4 pb-20">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-heading text-[var(--color-gold-900)] mb-4">
            Consent Form
          </h1>
          <p className="text-[var(--color-gold-700)] text-lg max-w-2xl mx-auto">
            Please read carefully and acknowledge the terms of our service before proceeding.
          </p>
        </div>
        
        <div className="bg-white p-6 md:p-12 rounded-[2rem] shadow-sm border border-[var(--color-gold-200)] relative overflow-hidden">
          <ConsentFormFlow therapists={therapists} />
        </div>
      </div>
    </div>
  );
}
