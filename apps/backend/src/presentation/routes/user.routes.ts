import { Router, Response } from "express";
import admin, { db } from "../../infrastructure/auth/firebase-admin";
import {
  authMiddleware,
  AuthenticatedRequest,
} from "../middlewares/auth.middleware";

const router = Router();

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/v1/user/profile
// Fetches the user's Firestore profile. Creates a default doc if first login.
// ─────────────────────────────────────────────────────────────────────────────
router.get(
  "/profile",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const uid = req.user!.uid;
      const userRef = db.collection("users").doc(uid);
      const snap = await userRef.get();

      if (!snap.exists) {
        const now = admin.firestore.Timestamp.now();
        const defaultProfile = {
          uid,
          email: req.user!.email ?? "",
          displayName: req.user!.displayName ?? "Adventurer",
          photoURL: req.user!.photoURL ?? null,
          xp: 0,
          level: 1,
          coins: 0,
          recoveryTokens: 2,
          createdAt: now,
          updatedAt: now,
        };
        await userRef.set(defaultProfile);
        return res.status(201).json({
          ...defaultProfile,
          createdAt: now.toDate().toISOString(),
          updatedAt: now.toDate().toISOString(),
        });
      }

      const data = snap.data()!;
      return res.status(200).json({
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString?.() ?? null,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString?.() ?? null,
      });
    } catch (error) {
      console.error("[user/profile GET]", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/v1/user/profile
// Updates user gamification fields: xp, coins, level, recoveryTokens,
// displayName. Only supplied fields are written.
// ─────────────────────────────────────────────────────────────────────────────
router.put(
  "/profile",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const uid = req.user!.uid;
      const { xp, coins, recoveryTokens, displayName, level } = req.body;

      const update: Record<string, unknown> = {
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };
      if (typeof xp === "number") update.xp = xp;
      if (typeof coins === "number") update.coins = coins;
      if (typeof level === "number") update.level = level;
      if (typeof recoveryTokens === "number")
        update.recoveryTokens = recoveryTokens;
      if (typeof displayName === "string") update.displayName = displayName;

      const userRef = db.collection("users").doc(uid);
      await userRef.update(update);

      const snap = await userRef.get();
      const data = snap.data()!;
      return res.status(200).json({
        ...data,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString?.() ?? null,
      });
    } catch (error) {
      console.error("[user/profile PUT]", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;
