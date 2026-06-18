"use server";

import { cookies } from "next/headers";
import { auth } from "@/lib/firebase-admin";

export async function createSession(idToken: string) {
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
    return { success: true };
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
