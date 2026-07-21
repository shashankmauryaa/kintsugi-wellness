"use server";

import { cookies } from "next/headers";
import { auth, db } from "@/lib/firebase-admin";

export async function updateTherapistProfile(profileData: any) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const decodedToken = await auth.verifySessionCookie(session, true);
    const uid = decodedToken.uid;
    
    // Only update allowed fields
    const updates = {
      name: profileData.name,
      title: profileData.title || "",
      email: profileData.email,
      phone: profileData.phone || "",
      bio: profileData.bio || "",
      personalNote: profileData.personalNote || "",
      background: profileData.background || [],
      approach: profileData.approach || { description: "", tags: [] },
      expectations: profileData.expectations || [],
      photoUrl: profileData.photoUrl || null,
    };

    const docRef = db.collection("therapist_profiles").doc(uid);
    const doc = await docRef.get();

    if (!doc.exists) {
      return { success: false, error: "Therapist profile not found." };
    }

    await docRef.update(updates);
    
    // If name or email changed, update Firebase Auth user record as well
    if (profileData.name || profileData.email) {
      const authUpdates: any = {};
      if (profileData.name) authUpdates.displayName = profileData.name;
      if (profileData.email) authUpdates.email = profileData.email;
      await auth.updateUser(uid, authUpdates);
    }

    return { success: true };
  } catch (error: any) {
    console.error("Update Therapist Profile Error:", error);
    return { success: false, error: error.message || "Failed to update profile." };
  }
}
