import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { auth, db } from "@/lib/firebase-admin";

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  
  if (!session) {
    redirect("/login");
  }

  let isTherapist = false;
  let hasError = false;

  try {
    const decodedToken = await auth.verifySessionCookie(session, true);
    
    // Check if they are a therapist
    const therapistDoc = await db.collection("therapist_profiles").doc(decodedToken.uid).get();
    if (therapistDoc.exists) {
      isTherapist = true;
    }
  } catch (error) {
    console.error("Dashboard Redirect Error:", error);
    hasError = true;
  }

  if (hasError) {
    redirect("/login?clear_session=1");
  }

  if (isTherapist) {
    redirect("/therapists");
  }

  // Otherwise, client
  redirect("/clients");
}
