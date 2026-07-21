import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { auth, db } from "@/lib/firebase-admin";
import MyInfoView from "./MyInfoView";

export default async function MyInfoPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  
  if (!session) {
    redirect("/login?redirect=/clients/my-info");
  }

  let userRecord;
  let profileData: any = null;
  let latestConsent: any = null;

  try {
    const decodedToken = await auth.verifySessionCookie(session, true);
    userRecord = await auth.getUser(decodedToken.uid);
    
    // Fetch profile data
    const profileDoc = await db.collection("clientProfiles").doc(decodedToken.uid).get();
    const rawProfileData = profileDoc.data();
    if (rawProfileData) {
      profileData = JSON.parse(JSON.stringify(rawProfileData));
    }
    
    // Fetch latest consent form (sort in memory to avoid requiring a composite index)
    const consentSnapshot = await db.collection("consentForms")
      .where("userId", "==", decodedToken.uid)
      .get();
      
    if (!consentSnapshot.empty) {
      // Sort in memory by consentedAt descending
      const sortedDocs = consentSnapshot.docs.sort((a: any, b: any) => {
        const dateA = a.data().consentedAt?.toMillis() || 0;
        const dateB = b.data().consentedAt?.toMillis() || 0;
        return dateB - dateA;
      });
      
      const rawConsent = sortedDocs[0].data();
      latestConsent = {
        ...rawConsent,
        consentedAt: rawConsent.consentedAt?.toDate().toISOString() || null
      };
    }
    
  } catch (error: any) {
    console.error("My Info Error:", error);
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 w-full text-center">
        <div className="bg-red-50 p-6 rounded-2xl max-w-2xl border border-red-200">
          <h2 className="text-xl font-heading text-red-700 mb-4">Error Loading Information</h2>
          <p className="text-red-600 mb-4 text-sm font-mono text-left bg-white p-4 rounded border border-red-100 overflow-x-auto">
            {error?.message || String(error)}
          </p>
          <a href="/login" className="mt-6 inline-block px-6 py-2 bg-red-600 text-white rounded-full text-sm font-medium">Return to Login</a>
        </div>
      </div>
    );
  }

  return (
    <MyInfoView 
      user={{ name: userRecord.displayName || "", email: userRecord.email || "" }} 
      profileData={profileData} 
      latestConsent={latestConsent} 
    />
  );
}
