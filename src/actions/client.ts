"use server";

import { cookies } from "next/headers";
import { auth, db } from "@/lib/firebase-admin";

export async function updateClientNickname(clientId: string, nickname: string) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const decodedToken = await auth.verifySessionCookie(session, true);
    const therapistId = decodedToken.uid;
    
    // Verify that this client is actually associated with this therapist
    const profileRef = db.collection("clientProfiles").doc(clientId);
    const profileDoc = await profileRef.get();
    
    if (!profileDoc.exists) {
      return { success: false, error: "Client profile not found" };
    }
    
    if (profileDoc.data()?.therapistId !== therapistId) {
      // Check if they have a booking instead
      const bookings = await db.collection("bookings")
        .where("therapistId", "==", therapistId)
        .where("userId", "==", clientId)
        .limit(1)
        .get();
        
      if (bookings.empty) {
        return { success: false, error: "Unauthorized to modify this client" };
      }
    }
    
    // Update the nickname
    await profileRef.set({
      nickname
    }, { merge: true });

    return { success: true };
  } catch (error: any) {
    console.error("Update Client Nickname Error:", error);
    return { success: false, error: "Failed to update nickname" };
  }
}
