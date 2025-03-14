import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

// Load Firebase service account key from environment variables
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

// Initialize Firebase Admin SDK (ensure only one instance is created)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// Export Firestore and Authentication services
export const auth = admin.auth();
export const db = admin.firestore();
