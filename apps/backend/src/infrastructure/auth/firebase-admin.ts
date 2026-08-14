import * as admin from "firebase-admin";
import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

dotenv.config();

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || "./src/config/service-account.json";
const resolvedPath = path.resolve(serviceAccountPath);

if (!admin.apps.length) {
  try {
    if (fs.existsSync(resolvedPath)) {
      const serviceAccount = JSON.parse(fs.readFileSync(resolvedPath, "utf8"));
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log("Firebase Admin SDK initialized successfully via service account file.");
    } else {
      // Fallback to default environment credentials if running on GCP / Firebase Hosting
      admin.initializeApp();
      console.log("Firebase Admin SDK initialized using default application credentials.");
    }
  } catch (error) {
    console.error("Failed to initialize Firebase Admin SDK:", error);
  }
}

export const auth = admin.auth();
export default admin;
