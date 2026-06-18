"use server";

import { cookies } from "next/headers";
import { auth, db } from "@/lib/firebase-admin";

export async function submitConsentForm(formData: any) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const decodedToken = await auth.verifySessionCookie(session, true);
    const uid = decodedToken.uid;

    const consentRef = db.collection("consentForms").doc();
    
    // Save the consent form
    await consentRef.set({
      id: consentRef.id,
      userId: uid,
      version: "1.0",
      pdfUrl: null, // To be generated
      signature: formData.signature,
      emergencyContact: formData.emergencyContact,
      clientDetails: {
        fullName: formData.fullName,
        age: formData.age,
        phone: formData.phone,
      },
      consentedAt: new Date(),
    });

    // Update or create the client profile
    const profileRef = db.collection("clientProfiles").doc(uid);
    await profileRef.set({
      userId: uid,
      age: formData.age,
      phone: formData.phone,
      emergencyContact: formData.emergencyContact,
      hasActiveConsent: true,
      updatedAt: new Date()
    }, { merge: true });

    return { success: true };
  } catch (error) {
    console.error("Consent submission error:", error);
    return { success: false, error: "Failed to submit consent form" };
  }
}
