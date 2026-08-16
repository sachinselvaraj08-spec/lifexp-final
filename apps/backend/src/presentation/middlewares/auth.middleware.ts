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

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Authorization Bearer token is missing or malformed.",
    });
  }

  const idToken = authHeader.split("Bearer ")[1];

  if (!idToken || idToken.trim() === "" || idToken === "null" || idToken === "undefined") {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Invalid token value provided.",
    });
  }

  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      displayName: decodedToken.name,
      photoURL: decodedToken.picture,
    };
    return next();
  } catch (error: any) {
    console.error("[AuthMiddleware] Firebase Token verification failed:", error?.message || error);
    return res.status(401).json({
      error: "Unauthorized",
      message: error?.message || "Invalid or expired authorization token.",
    });
  }
}
