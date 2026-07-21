"use server";

import { cookies } from "next/headers";
import { auth, db } from "@/lib/firebase-admin";

export async function createSession(idToken: string, isTherapistSignup: boolean = false) {
  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
  try {
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });
    const options = {
      name: "session",
      value: sessionCookie,
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax" as const,
    };

    const cookieStore = await cookies();
    cookieStore.set(options);

    // Determine user type and create therapist profile if requested
    const decodedToken = await auth.verifyIdToken(idToken);
    let userType = "client";

    if (isTherapistSignup) {
      const docRef = db.collection('therapist_profiles').doc(decodedToken.uid);
      const doc = await docRef.get();
      if (!doc.exists) {
        await docRef.set({
          id: decodedToken.uid,
          name: decodedToken.name || decodedToken.email?.split('@')[0] || "New Therapist",
          email: decodedToken.email,
          isActive: false,
          bio: "",
          personalNote: "",
          background: [],
          approach: { description: "", tags: [] },
          expectations: [],
        });
      }
      userType = "therapist";
    } else {
      // Check if they are a therapist already
      const doc = await db.collection('therapist_profiles').doc(decodedToken.uid).get();
      if (doc.exists) {
        userType = "therapist";
      }
    }

    return { success: true, userType };
  } catch (error) {
    console.error("Session creation error:", error);
    return { success: false, error: "Unauthorized request" };
  }
}

export async function removeSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  return { success: true };
}
