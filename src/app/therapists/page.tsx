import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { auth, db } from "@/lib/firebase-admin";
import TherapistDashboard from "./TherapistDashboard";

export default async function TherapistPortal() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  
  if (!session) {
    redirect("/login?redirect=/therapists");
  }

  let profileData: any = null;
  let shouldRedirect = false;

  try {
    const decodedToken = await auth.verifySessionCookie(session, true);
    const profileDoc = await db.collection("therapist_profiles").doc(decodedToken.uid).get();
    
    if (!profileDoc.exists) {
      shouldRedirect = true;
    } else {
      const rawProfileData = profileDoc.data();
      if (rawProfileData) {
        profileData = JSON.parse(JSON.stringify(rawProfileData));
      }
    }
  } catch (error: any) {
    console.error("Therapist Portal Error:", error);
    shouldRedirect = true;
  }

  if (shouldRedirect) {
    redirect("/clients"); // Send them to clients if they aren't a therapist
  }

  return (
    <TherapistDashboard initialProfile={profileData} />
  );
}
