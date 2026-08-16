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
// Returns all habits for the authenticated user, sorted by createdAt.
// Uses in-memory sorting and a 8s timeout guard to prevent Firestore hangs.
// ─────────────────────────────────────────────────────────────────────────────
router.get(
  "/",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    const uid = req.user!.uid;
    const maskedUid = uid ? `${uid.substring(0, 6)}***` : "unknown";
    console.log(`[habits GET] Incoming request from authenticated user: ${maskedUid}`);

    try {
      console.log(`[habits GET] Querying Firestore path: users/${maskedUid}/habits`);

      // 8-second timeout race guard to prevent Vercel serverless function hangs
      const fetchPromise = db
        .collection("users")
        .doc(uid)
        .collection("habits")
        .get();

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(
          () => reject(new Error("Firestore database query timed out after 8s")),
          8000
        )
      );

      const snap = (await Promise.race([
        fetchPromise,
        timeoutPromise,
      ])) as admin.firestore.QuerySnapshot;

      console.log(`[habits GET] Successfully retrieved ${snap.size} documents from Firestore.`);

      const habits = snap.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.()?.toISOString?.() ?? (typeof data.createdAt === "string" ? data.createdAt : null),
          updatedAt: data.updatedAt?.toDate?.()?.toISOString?.() ?? (typeof data.updatedAt === "string" ? data.updatedAt : null),
        };
      });

      // Sort in-memory to prevent index requirements or missing field query blocks
      habits.sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeA - timeB;
      });

      return res.status(200).json(habits);
    } catch (error: any) {
      console.error(`[habits GET] Query failed for UID ${maskedUid}:`, error?.message || error);
      return res.status(500).json({
        error: "Firestore Query Error",
        message: error?.message || "Failed to fetch habits from database.",
      });
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
    const uid = req.user!.uid;
    const maskedUid = uid ? `${uid.substring(0, 6)}***` : "unknown";

    try {
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

      console.log(`[habits POST] Creating habit '${title.trim()}' for UID: ${maskedUid}`);

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
      console.log(`[habits POST] Habit created successfully with ID: ${docRef.id}`);

      return res.status(201).json({
        id: docRef.id,
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error(`[habits POST] Creation failed for UID ${maskedUid}:`, error?.message || error);
      return res.status(500).json({
        error: "Firestore Creation Error",
        message: error?.message || "Failed to create habit in database.",
      });
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
    const uid = req.user!.uid;
    const maskedUid = uid ? `${uid.substring(0, 6)}***` : "unknown";

    try {
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
    } catch (error: any) {
      console.error(`[habits PUT] Update failed for UID ${maskedUid}:`, error?.message || error);
      return res.status(500).json({
        error: "Firestore Update Error",
        message: error?.message || "Failed to update habit in database.",
      });
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
    const uid = req.user!.uid;
    const maskedUid = uid ? `${uid.substring(0, 6)}***` : "unknown";

    try {
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
      console.log(`[habits DELETE] Deleted habit ${habitId} for UID: ${maskedUid}`);
      return res.status(200).json({ message: "Habit deleted successfully" });
    } catch (error: any) {
      console.error(`[habits DELETE] Delete failed for UID ${maskedUid}:`, error?.message || error);
      return res.status(500).json({
        error: "Firestore Delete Error",
        message: error?.message || "Failed to delete habit from database.",
      });
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/v1/habits/:habitId/complete
// Toggles completion for a given date (YYYY-MM-DD).
// Recalculates streak. Returns xpAwarded.
// ─────────────────────────────────────────────────────────────────────────────
router.post(
  "/:habitId/complete",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    const uid = req.user!.uid;
    const maskedUid = uid ? `${uid.substring(0, 6)}***` : "unknown";

    try {
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
        xpAwarded: nowCompleted ? habit.xpReward ?? 50 : 0,
      });
    } catch (error: any) {
      console.error(`[habits complete] Toggle failed for UID ${maskedUid}:`, error?.message || error);
      return res.status(500).json({
        error: "Firestore Toggle Error",
        message: error?.message || "Failed to update completion status.",
      });
    }
  }
);

export default router;
