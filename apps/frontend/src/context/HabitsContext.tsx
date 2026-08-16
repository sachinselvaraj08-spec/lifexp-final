"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext";
import { api } from "../services/api";

// ─────────────────────────────────────────────────────────────────────────────
// Shared Habit type (used by both Dashboard and Habits page)
// ─────────────────────────────────────────────────────────────────────────────
export interface Habit {
  id: string;
  title: string;
  category: "Health" | "Productivity" | "Learning" | "Mindfulness";
  frequency: "daily" | "weekly" | "monthly";
  targetQuantity: number;
  unit: string;
  xpReward: number;
  currentStreak: number;
  longestStreak: number;
  /** Map of YYYY-MM-DD → boolean completion status */
  logs: Record<string, boolean>;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateHabitInput = Pick<
  Habit,
  "title" | "category" | "frequency" | "targetQuantity" | "unit"
>;

// ─────────────────────────────────────────────────────────────────────────────
// Context type
// ─────────────────────────────────────────────────────────────────────────────
interface HabitsContextType {
  habits: Habit[];
  isLoading: boolean;
  error: string | null;
  createHabit: (data: CreateHabitInput) => Promise<void>;
  updateHabit: (id: string, data: Partial<CreateHabitInput>) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  /**
   * Toggles completion for habitId on dateStr.
   * Returns the xpAwarded amount so the caller can credit GamificationContext.
   */
  toggleCompletion: (habitId: string, dateStr: string) => Promise<number>;
}

const HabitsContext = createContext<HabitsContextType | undefined>(undefined);

// ─────────────────────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────────────────────
export const HabitsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { token, user, loading, getIdToken } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Fetch all habits when auth restoration completes ─────────────────────
  useEffect(() => {
    // Wait until Firebase Auth finishes restoring session
    if (loading) return;

    if (!user?.uid) {
      setHabits([]);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    const loadHabits = async () => {
      console.log("[HABITS DEBUG]", {
        authLoading: loading,
        currentUser: !!user,
        uid: user?.uid ?? null,
        backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
      });
      console.log("[HABITS DEBUG] GET /api/v1/habits");

      try {
        const data = await api.get<Habit[]>("/api/v1/habits");
        const parsedHabits = Array.isArray(data) ? data : (data as any)?.data || [];
        if (!cancelled) {
          setHabits(parsedHabits);
          setError(null);
        }
      } catch (err: any) {
        console.error("[HABITS DEBUG] Fetch habits failed:", err);
        if (!cancelled) {
          setError(`Failed to load habits: ${err?.message || "Unauthorized"}`);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadHabits();

    return () => {
      cancelled = true;
    };
  }, [user?.uid, loading]);

  // ── Create ────────────────────────────────────────────────────────────────
  const createHabit = useCallback(
    async (data: CreateHabitInput) => {
      const created = await api.post<Habit>(
        "/api/v1/habits",
        data as unknown as Record<string, unknown>
      );
      setHabits((prev) => [...prev, created]);
    },
    []
  );

  // ── Update ────────────────────────────────────────────────────────────────
  const updateHabit = useCallback(
    async (id: string, data: Partial<CreateHabitInput>) => {
      const updated = await api.put<Habit>(
        `/api/v1/habits/${id}`,
        data as unknown as Record<string, unknown>
      );
      setHabits((prev) => prev.map((h) => (h.id === id ? updated : h)));
    },
    []
  );

  // ── Delete ────────────────────────────────────────────────────────────────
  const deleteHabit = useCallback(
    async (id: string) => {
      await api.delete(`/api/v1/habits/${id}`);
      setHabits((prev) => prev.filter((h) => h.id !== id));
    },
    []
  );

  // ── Toggle completion (optimistic update) ─────────────────────────────────
  const toggleCompletion = useCallback(
    async (habitId: string, dateStr: string): Promise<number> => {

      // 1. Optimistic UI update
      setHabits((prev) =>
        prev.map((h) => {
          if (h.id !== habitId) return h;
          const wasCompleted = !!h.logs[dateStr];
          const updatedLogs = { ...h.logs, [dateStr]: !wasCompleted };
          const optimisticStreak = !wasCompleted
            ? h.currentStreak + 1
            : Math.max(0, h.currentStreak - 1);
          return {
            ...h,
            logs: updatedLogs,
            currentStreak: optimisticStreak,
            longestStreak: Math.max(h.longestStreak, optimisticStreak),
          };
        })
      );

      // 2. Persist to backend
      try {
        const result = await api.post<Habit & { xpAwarded: number }>(
          `/api/v1/habits/${habitId}/complete`,
          { dateStr }
        );
        // Sync state with server-calculated streak
        setHabits((prev) =>
          prev.map((h) => (h.id === habitId ? { ...result, id: result.id } : h))
        );
        return result.xpAwarded ?? 0;
      } catch (err) {
        console.error("[HabitsContext] toggleCompletion failed:", err);
        // 3. Revert optimistic update on error
        setHabits((prev) =>
          prev.map((h) => {
            if (h.id !== habitId) return h;
            const wasCompleted = !!h.logs[dateStr];
            return {
              ...h,
              logs: { ...h.logs, [dateStr]: !wasCompleted }, // toggle back
            };
          })
        );
        return 0;
      }
    },
    [token, getIdToken]
  );

  return (
    <HabitsContext.Provider
      value={{
        habits,
        isLoading,
        error,
        createHabit,
        updateHabit,
        deleteHabit,
        toggleCompletion,
      }}
    >
      {children}
    </HabitsContext.Provider>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────
export const useHabits = () => {
  const ctx = useContext(HabitsContext);
  if (!ctx) throw new Error("useHabits must be used within HabitsProvider");
  return ctx;
};
