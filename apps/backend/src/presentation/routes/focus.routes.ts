import { Router, Response } from "express";
import admin, { db } from "../../infrastructure/auth/firebase-admin";
import {
  authMiddleware,
  AuthenticatedRequest,
} from "../middlewares/auth.middleware";

const router = Router();

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/v1/focus/daily
// Returns today's dailyProgress document (or zeroed defaults if none).
// ─────────────────────────────────────────────────────────────────────────────
router.get(
  "/daily",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const uid = req.user!.uid;
      const today = new Date().toISOString().split("T")[0];

      const ref = db
        .collection("users")
        .doc(uid)
        .collection("dailyProgress")
        .doc(today);

      const snap = await ref.get();

      if (!snap.exists) {
        return res.status(200).json({
          date: today,
          totalFocusMinutes: 0,
          completedSessions: 0,
          habitsCompleted: 0,
        });
      }

      const data = snap.data()!;
      return res.status(200).json({
        date: today,
        totalFocusMinutes: data.totalFocusMinutes ?? 0,
        completedSessions: data.completedSessions ?? 0,
        habitsCompleted: data.habitsCompleted ?? 0,
      });
    } catch (error) {
      console.error("[focus/daily GET]", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/v1/focus/sessions
// Saves a completed focus session and updates today's dailyProgress.
// XP and coins are NOT written to the user doc here — the frontend handles
// those via PUT /api/v1/user/profile (single source of truth).
// ─────────────────────────────────────────────────────────────────────────────
router.post(
  "/sessions",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const uid = req.user!.uid;
      const { mode, durationMinutes, xpEarned, coinsEarned } = req.body as {
        mode?: string;
        durationMinutes?: number;
        xpEarned?: number;
        coinsEarned?: number;
      };

      if (!mode) {
        return res.status(400).json({ error: "mode is required" });
      }
      if (typeof durationMinutes !== "number" || durationMinutes <= 0) {
        return res
          .status(400)
          .json({ error: "durationMinutes must be a positive number" });
      }

      const today = new Date().toISOString().split("T")[0];

      // ── 1. Persist the focus session document ─────────────────────────────
      const sessionData = {
        mode,
        durationMinutes,
        xpEarned: xpEarned ?? 0,
        coinsEarned: coinsEarned ?? 0,
        completedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      const sessionRef = await db
        .collection("users")
        .doc(uid)
        .collection("focusSessions")
        .add(sessionData);

      // ── 2. Upsert today's dailyProgress ───────────────────────────────────
      const dailyRef = db
        .collection("users")
        .doc(uid)
        .collection("dailyProgress")
        .doc(today);

      const dailySnap = await dailyRef.get();
      if (dailySnap.exists) {
        await dailyRef.update({
          totalFocusMinutes: admin.firestore.FieldValue.increment(durationMinutes),
          completedSessions: admin.firestore.FieldValue.increment(1),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      } else {
        await dailyRef.set({
          date: today,
          totalFocusMinutes: durationMinutes,
          completedSessions: 1,
          habitsCompleted: 0,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }

      // ── 3. Return updated daily progress ──────────────────────────────────
      const updatedDaily = await dailyRef.get();
      const dailyData = updatedDaily.data()!;

      return res.status(201).json({
        session: { id: sessionRef.id, ...sessionData },
        dailyProgress: {
          date: today,
          totalFocusMinutes: dailyData.totalFocusMinutes ?? 0,
          completedSessions: dailyData.completedSessions ?? 0,
          habitsCompleted: dailyData.habitsCompleted ?? 0,
        },
      });
    } catch (error) {
      console.error("[focus/sessions POST]", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;
