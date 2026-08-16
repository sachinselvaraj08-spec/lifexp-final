import * as admin from "firebase-admin";
import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

dotenv.config();

if (!admin.apps.length) {
  try {
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    const serviceAccountPath =
      process.env.FIREBASE_SERVICE_ACCOUNT_PATH || "./src/config/service-account.json";
    const resolvedPath = path.resolve(serviceAccountPath);

    if (serviceAccountJson) {
      // Production / Vercel: credentials supplied as an env-var JSON string
      const serviceAccount = typeof serviceAccountJson === "string" 
        ? JSON.parse(serviceAccountJson)
        : serviceAccountJson;

      // Handle escaped newlines in private key if present (common Vercel env var formatting)
      if (serviceAccount && typeof serviceAccount.private_key === "string") {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
      }

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.project_id || process.env.FIREBASE_PROJECT_ID || "lifexp-9df28",
      });
      console.log("[Firebase] Admin SDK initialized for project:", serviceAccount.project_id || "lifexp-9df28");
    } else if (fs.existsSync(resolvedPath)) {
      // Local development fallback: credentials file on disk
      const serviceAccount = JSON.parse(fs.readFileSync(resolvedPath, "utf8"));

      if (serviceAccount && typeof serviceAccount.private_key === "string") {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
      }

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.project_id || process.env.FIREBASE_PROJECT_ID || "lifexp-9df28",
      });
      console.log("[Firebase] Admin SDK initialized from service account file:", resolvedPath);
    } else {
      // GCP / Firebase Hosting default application credentials
      admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID || "lifexp-9df28",
      });
      console.log("[Firebase] Admin SDK initialized using default application credentials.");
    }
  } catch (error) {
    console.error("[Firebase] Failed to initialize Firebase Admin SDK:", error);
    process.exit(1);
  }
}

export const auth = admin.auth();
export const db = admin.firestore();
export default admin;
