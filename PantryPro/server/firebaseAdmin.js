import admin from "firebase-admin";
import { readFile } from "fs/promises";
import dotenv from "dotenv";

dotenv.config();

const serviceAccountPath = new URL("./serviceAccountKey.json", import.meta.url);

let serviceAccount;
try {
  serviceAccount = JSON.parse(await readFile(serviceAccountPath));
} catch (error) {
  console.error("Failed to read service account key:", error);
  process.exit(1);
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

console.log("Firebase Admin initialized successfully");

export const auth = admin.auth();
export const db = admin.firestore();
