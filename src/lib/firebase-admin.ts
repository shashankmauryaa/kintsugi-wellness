import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

if (!getApps().length) {
  try {
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY) {
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          // Replace literal \n with actual newlines
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
      });
    } else {
      console.warn("Firebase env variables missing. Skipping initialization to allow Vercel build to succeed.");
    }
  } catch (error) {
    console.warn("Firebase Admin initialization error:", error);
  }
}

const db = getApps().length > 0 ? getFirestore() : null as any;
const auth = getApps().length > 0 ? getAuth() : null as any;

export { db, auth };
