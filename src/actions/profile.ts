"use server";

import { cookies } from "next/headers";
import { auth, db } from "@/lib/firebase-admin";

export async function updateClientInfo(formData: {
  age: string;
  phone: string;
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
}) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const decodedToken = await auth.verifySessionCookie(session, true);
    const uid = decodedToken.uid;

    const profileRef = db.collection("clientProfiles").doc(uid);
    await profileRef.set({
      age: formData.age,
      phone: formData.phone,
      emergencyContact: formData.emergencyContact,
      updatedAt: new Date()
    }, { merge: true });

    return { success: true };
  } catch (error: any) {
    console.error("Profile update error:", error);
    return { success: false, error: error.message || "Failed to update profile" };
  }
}
