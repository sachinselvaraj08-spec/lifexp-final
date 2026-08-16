import { Request, Response, NextFunction } from "express";
import { auth } from "../../infrastructure/auth/firebase-admin";

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email?: string;
    displayName?: string;
    photoURL?: string;
  };
}

export async function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  console.log("[AUTH] Authorization header present:", !!authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.error("[AUTH] Rejecting request: Authorization header missing or malformed.");
    return res.status(401).json({
      success: false,
      error: "Missing or malformed Authorization header",
      message: "Authorization Bearer token is missing or malformed.",
    });
  }

  const idToken = authHeader.split("Bearer ")[1];
  console.log("[AUTH] Bearer token present:", !!idToken && idToken.length > 10);

  if (!idToken || idToken.trim() === "" || idToken === "null" || idToken === "undefined") {
    console.error("[AUTH] Rejecting request: Invalid token value provided.");
    return res.status(401).json({
      success: false,
      error: "Invalid Authorization header",
      message: "Invalid token value provided.",
    });
  }

  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    console.log("[AUTH] Firebase token verified successfully for UID:", decodedToken.uid);

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      displayName: decodedToken.name,
      photoURL: decodedToken.picture,
    };
    return next();
  } catch (error: any) {
    const expectedProjectId = auth.app.options.projectId || process.env.FIREBASE_PROJECT_ID || "lifexp-9df28";
    console.error("[AUTH] Firebase token verification failed:", {
      code: error?.code,
      message: error?.message,
      expectedProjectId,
    });
    return res.status(401).json({
      success: false,
      error: error?.message || "Invalid or expired authorization token",
      message: error?.message || "Invalid or expired authorization token.",
      code: error?.code || "auth/invalid-token",
      expectedProjectId,
    });
  }
}
