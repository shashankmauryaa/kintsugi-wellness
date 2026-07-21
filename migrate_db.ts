import * as admin from 'firebase-admin';

// OLD App configuration
const oldApp = admin.initializeApp({
  credential: admin.credential.cert({
    projectId: "kintsugi-wellness",
    clientEmail: "firebase-adminsdk-fbsvc@kintsugi-wellness.iam.gserviceaccount.com",
    privateKey: "-----BEGIN PRIVATE KEY-----\\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC+5ZSvbEzUEaNU\\ng8qMM8D1E1Wfce4xFkX5ETMgsYRNWtuvI+L+h9zD8vAShbnsKLqf/eta9kOER6a3\\nOoOrvvBhRGn7yqZq8OafCxzzO5UbTpbvMOXn91CGYqaUTqE2YCcQZRj8FPBSO6AK\\n1AxSMyEoQMmAmepit5y+vgKHZfIVs+nNeycoPy1jGaRslmVf1ZO79UOfk7N4RY+F\\n9TXox6+ZtHvknvDbsGqgelvRMLU+iSPum9pv+WQamgfScFQN5xuKjdwqkKD2xHQr\\nm7EtdkyGaQCENaBQF8499ahKc7ftCQQbtSFaTna6WXzXVnEpxc9DHq6aEghLH13e\\n39aiajgLAgMBAAECggEAXqnUcKVg9+0DNJ7iK2JitmVvGVFTD+5+poM7+mNtOzrq\\nI9DE+PmApX7sRBMiXpTX7wzo0EO8uXUanFQdBWb7JxDZCa61leR+SLInGgsa5t6z\\nBEwYRk6jFPEIsBTJ5wAJfxzTJfZwMic1NwluTrjiIWb3RZmN3IQ263OoJ2KLiOzC\\nHK+iqPUIDqz3/pYyHG3996HSMeoSXhtOO05D9D0jamr65xgyjYZ5+DHPPVkWoW6c\\nmLaoSk85oHHxLk1uYmbHxq61gwwR2VUO6Od3ukmN2QcxP7VMPe0oQa0UoSfmzScK\\nqLcvbMQG/rbjtNOrXATfCxra+32+0Z2iEAZ2YkukeQKBgQDtg/+6r9NNYZCHIj/z\\n1IzkMfGdZbcUw2WgkCZRoOj/Ikg5gqvpKOH4SyfIM6fBdJOC2WF33vLIXbM+2Zwm\\n5T6SbtHfBHIImmHmOq08LY5gkzsfTbAS8IPEsUc+rBp3r+49bAkPA1+UCThBvw83\\n8/3DdiTXvN+FphQDxqyR1pQ4RwKBgQDNwMyujBnZmKakAFSIIYArWPT5u+NYRoCi\\nANsdcwEnlqcZZaqkRmqZgk+Qan8I/Xln9olgkONJowVBwi4axlufHQ3KrIfn4rUG\\nxvN6SYIJkD/kg6iRDt+iDYJ6rbqCuLbdFz4K0z03ynzAl2Wet7qtlQRw+F4nv0ud\\nyyhO8aVoHQKBgFtCdZboidrYmuyhR0tLptrjKb/dXiwXK8w2ttJ0bjHhnTijsaQD\\ntldtoRp2ZoWZYjhLh/zD6Cr+famveSUkvhcLh44WKi6OCwGoF/ngUy1eRMAxXG7a\\nhPalWweEnyLPsU1eXlirZiT+KeRxIcrQ7/cTRPKzunqiplwREStz9D1vAoGANjGo\\nN/ly/Zt1mRD1Mv4P8lr1+6l/kkrPqtwq2rDmBvVpggkDT0202kY2isViPI33ImkP\\nej3vf//ObKmm1yqUC27tqQqUqYFPST+x9e3SsI4sJhZ/meWfBeIlEgccbz4T/FwY\\n3WUSZNWS0m+ONqYSJ5JunwrsUe/TDPbr4Q9JEAkCgYBCTKbLW2oUKmvpky7L1PA0\\n8/LGj2AGqgEQ4YLwGs2TIJmi/Vhzdg+FyJRdP22vdJRXXyVwYuAh47gRmQoyoI7y\\nTHJvMsF9XKwrmlqGwuyayu1zcwVJB2J5DuFqBngddrocYPqUvNIX8qEc5MjY6vNI\\nAQ4F8aJfddFWu5IgyEjcMA==\\n-----END PRIVATE KEY-----\\n".replace(/\\n/g, '\n')
  })
}, 'oldApp');

// NEW App configuration (reads from .env.local via dotenv automatically in run command)
const newApp = admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID!,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
    privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
  })
}, 'newApp');

const oldDb = oldApp.firestore();
const newDb = newApp.firestore();

// The collections to migrate
const collections = ['bookings', 'contacts', 'therapist_profiles', 'clients', 'consentForms'];

async function runMigration() {
  try {
    for (const collectionName of collections) {
      console.log(`\\n--- Migrating collection: ${collectionName} ---`);
      
      const snapshot = await oldDb.collection(collectionName).get();
      if (snapshot.empty) {
        console.log(`No documents found in ${collectionName}.`);
        continue;
      }

      console.log(`Found ${snapshot.size} documents in ${collectionName}. Copying...`);
      
      const batch = newDb.batch();
      let count = 0;
      
      snapshot.forEach((doc) => {
        // If the document is Khushi's old therapist profile (which we just migrated to her UID), skip it to avoid overwriting her new profile ID. 
        if (collectionName === 'therapist_profiles' && doc.id === 'khushi-mundra') {
          console.log(`Skipping 'khushi-mundra' document as it was already linked to an Auth UID.`);
          return; // continue in forEach
        }
        
        const newRef = newDb.collection(collectionName).doc(doc.id);
        batch.set(newRef, doc.data());
        count++;
      });

      if (count > 0) {
        await batch.commit();
        console.log(`Successfully migrated ${count} documents for ${collectionName}.`);
      }
    }
    
    console.log("\\nAll migrations completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  }
}

runMigration();
