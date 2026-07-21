import { auth, db } from "./src/lib/firebase-admin";

async function run() {
  try {
    const email = "khushiimundrawork@gmail.com";
    const password = "Password123!"; // Temporary password
    
    console.log("Creating user in Firebase Auth...");
    let user;
    try {
      user = await auth.getUserByEmail(email);
      console.log("User already exists with UID:", user.uid);
    } catch (e) {
      user = await auth.createUser({
        email: email,
        password: password,
        displayName: "Khushi Mundra",
      });
      console.log("Created new user with UID:", user.uid);
    }

    console.log("Fetching old profile data...");
    const oldProfileRef = db.collection("therapist_profiles").doc("khushi-mundra");
    const oldProfileDoc = await oldProfileRef.get();

    if (oldProfileDoc.exists) {
      console.log("Moving profile data to new UID...");
      const data = oldProfileDoc.data();
      
      // Save under the real auth UID
      await db.collection("therapist_profiles").doc(user.uid).set({
        ...data,
        id: user.uid
      });
      
      // Delete old hardcoded one
      await oldProfileRef.delete();
      console.log("Successfully migrated Khushi's profile to her real Auth account.");
    } else {
      console.log("Old profile 'khushi-mundra' not found. It may have already been migrated.");
    }
    
    console.log(`\\n\\nSUCCESS! You can now log in with:\\nEmail: ${email}\\nPassword: ${password}\\n`);
  } catch (error) {
    console.error("Failed:", error);
  }
}

run();
