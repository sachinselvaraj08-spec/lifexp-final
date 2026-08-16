import { Router, Response } from "express";
import admin, { db } from "../../infrastructure/auth/firebase-admin";
import {
  authMiddleware,
  AuthenticatedRequest,
} from "../middlewares/auth.middleware";

const router = Router();

// ─────────────────────────────────────────────────────────────────────────────
// Streak helper — counts consecutive completed days ending on/before today
// ─────────────────────────────────────────────────────────────────────────────
function calculateStreak(logs: Record<string, boolean>): number {
  let streak = 0;
  const cursor = new Date();
  // Walk backwards from today
  for (let i = 0; i < 365; i++) {
    const dateStr = cursor.toISOString().split("T")[0];
    if (logs[dateStr] === true) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/v1/habits
// Returns all habits for the authenticated user, ordered by createdAt.
// ─────────────────────────────────────────────────────────────────────────────
router.get(
  "/",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const uid = req.user!.uid;
      const snap = await db
        .collection("users")
        .doc(uid)
        .collection("habits")
        .orderBy("createdAt", "asc")
        .get();

      const habits = snap.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.()?.toISOString?.() ?? null,
          updatedAt: data.updatedAt?.toDate?.()?.toISOString?.() ?? null,
        };
      });

      return res.status(200).json(habits);
    } catch (error) {
      console.error("[habits GET]", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/v1/habits
// Creates a new habit document under users/{uid}/habits/{habitId}.
// ─────────────────────────────────────────────────────────────────────────────
router.post(
  "/",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const uid = req.user!.uid;
      const { title, category, frequency, targetQuantity, unit } = req.body;

      if (!title || typeof title !== "string" || !title.trim()) {
        return res.status(400).json({ error: "title is required" });
      }
      if (!category) {
        return res.status(400).json({ error: "category is required" });
      }
      if (!frequency) {
        return res.status(400).json({ error: "frequency is required" });
      }

      const now = admin.firestore.FieldValue.serverTimestamp();
      const habitData = {
        title: title.trim(),
        category: category ?? "Health",
        frequency: frequency ?? "daily",
        targetQuantity: targetQuantity ?? 1,
        unit: unit ?? "times",
        xpReward: 50,
        currentStreak: 0,
        longestStreak: 0,
        logs: {},
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await db
        .collection("users")
        .doc(uid)
        .collection("habits")
        .add(habitData);

      const created = await docRef.get();
      const data = created.data()!;
      return res.status(201).json({
        id: docRef.id,
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("[habits POST]", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/v1/habits/:habitId
// Updates editable fields of a habit (title, category, frequency, etc.).
// ─────────────────────────────────────────────────────────────────────────────
router.put(
  "/:habitId",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const uid = req.user!.uid;
      const { habitId } = req.params;
      const { title, category, frequency, targetQuantity, unit } = req.body;

      const habitRef = db
        .collection("users")
        .doc(uid)
        .collection("habits")
        .doc(habitId);

      const snap = await habitRef.get();
      if (!snap.exists) {
        return res.status(404).json({ error: "Habit not found" });
      }

      const update: Record<string, unknown> = {
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };
      if (typeof title === "string" && title.trim())
        update.title = title.trim();
      if (category) update.category = category;
      if (frequency) update.frequency = frequency;
      if (typeof targetQuantity === "number")
        update.targetQuantity = targetQuantity;
      if (typeof unit === "string") update.unit = unit;

      await habitRef.update(update);
      const updated = await habitRef.get();
      const data = updated.data()!;
      return res.status(200).json({
        id: updated.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString?.() ?? null,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString?.() ?? null,
      });
    } catch (error) {
      console.error("[habits PUT]", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/v1/habits/:habitId
// ─────────────────────────────────────────────────────────────────────────────
router.delete(
  "/:habitId",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const uid = req.user!.uid;
      const { habitId } = req.params;

      const habitRef = db
        .collection("users")
        .doc(uid)
        .collection("habits")
        .doc(habitId);

      const snap = await habitRef.get();
      if (!snap.exists) {
        return res.status(404).json({ error: "Habit not found" });
      }

      await habitRef.delete();
      return res.status(200).json({ message: "Habit deleted successfully" });
    } catch (error) {
      console.error("[habits DELETE]", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/v1/habits/:habitId/complete
// Toggles completion for a given date (YYYY-MM-DD).
// Recalculates streak. Returns xpAwarded (50 when completing, 0 when uncompleting).
// NOTE: XP is NOT written to Firestore here — the frontend handles that via
//       PUT /api/v1/user/profile so there is a single source of truth.
// ─────────────────────────────────────────────────────────────────────────────
router.post(
  "/:habitId/complete",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const uid = req.user!.uid;
      const { habitId } = req.params;
      const { dateStr } = req.body as { dateStr?: string };

      if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        return res
          .status(400)
          .json({ error: "dateStr must be a valid YYYY-MM-DD string" });
      }

      const habitRef = db
        .collection("users")
        .doc(uid)
        .collection("habits")
        .doc(habitId);

      const snap = await habitRef.get();
      if (!snap.exists) {
        return res.status(404).json({ error: "Habit not found" });
      }

      const habit = snap.data()!;
      const existingLogs: Record<string, boolean> = habit.logs ?? {};
      const wasCompleted = existingLogs[dateStr] === true;
      const nowCompleted = !wasCompleted;

      const updatedLogs = { ...existingLogs, [dateStr]: nowCompleted };
      const newStreak = calculateStreak(updatedLogs);
      const newLongest = Math.max(habit.longestStreak ?? 0, newStreak);

      await habitRef.update({
        logs: updatedLogs,
        currentStreak: newStreak,
        longestStreak: newLongest,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Update today's dailyProgress doc
      const today = new Date().toISOString().split("T")[0];
      if (dateStr === today) {
        const dailyRef = db
          .collection("users")
          .doc(uid)
          .collection("dailyProgress")
          .doc(today);
        const dailySnap = await dailyRef.get();
        if (dailySnap.exists) {
          await dailyRef.update({
            habitsCompleted: admin.firestore.FieldValue.increment(
              nowCompleted ? 1 : -1
            ),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });
        } else {
          await dailyRef.set({
            date: today,
            totalFocusMinutes: 0,
            completedSessions: 0,
            habitsCompleted: nowCompleted ? 1 : 0,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });
        }
      }

      const updated = await habitRef.get();
      const data = updated.data()!;
      return res.status(200).json({
        id: updated.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString?.() ?? null,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString?.() ?? null,
        // Frontend uses this to call addXP via GamificationContext
        xpAwarded: nowCompleted ? habit.xpReward ?? 50 : 0,
      });
    } catch (error) {
      console.error("[habits/:habitId/complete POST]", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;
