"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { api } from "../services/api";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
export interface Achievement {
  id: string;
  code: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  coinReward: number;
  unlocked: boolean;
  claimed: boolean;
}

interface GamificationContextType {
  xp: number;
  level: number;
  coins: number;
  recoveryTokens: number;
  achievements: Achievement[];
  isLoaded: boolean;
  addXP: (amount: number, reason?: string) => void;
  addCoins: (amount: number) => void;
  buyRecoveryToken: () => boolean;
  useRecoveryToken: () => boolean;
  claimAchievement: (id: string) => void;
  recentLevelUp: number | null;
  clearLevelUpBanner: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
const calculateLevel = (currentXp: number) => Math.floor(currentXp / 250) + 1;

interface UserProfile {
  xp?: number;
  coins?: number;
  recoveryTokens?: number;
  level?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────────────────────
const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export const GamificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, user, loading, getIdToken } = useAuth();

  // ── State ──────────────────────────────────────────────────────────────────
  const [xp, setXp] = useState(0);
  const [coins, setCoins] = useState(0);
  const [recoveryTokens, setRecoveryTokens] = useState(2);
  const [isLoaded, setIsLoaded] = useState(false);
  const [recentLevelUp, setRecentLevelUp] = useState<number | null>(null);

  const level = calculateLevel(xp);

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: "a1",
      code: "FIRST_HABIT",
      title: "First Step",
      description: "Complete your first habit entry",
      icon: "🌱",
      xpReward: 100,
      coinReward: 25,
      unlocked: true,
      claimed: true,
    },
    {
      id: "a2",
      code: "STREAK_7",
      title: "Streak Master I",
      description: "Maintain a 7-day streak on any habit",
      icon: "🔥",
      xpReward: 250,
      coinReward: 50,
      unlocked: true,
      claimed: false,
    },
    {
      id: "a3",
      code: "FOCUS_5H",
      title: "Deep Focus Initiate",
      description: "Accumulate 5 hours of focus time",
      icon: "🎯",
      xpReward: 300,
      coinReward: 75,
      unlocked: true,
      claimed: false,
    },
    {
      id: "a4",
      code: "STREAK_RECOVERY",
      title: "Phoenix Rising",
      description: "Successfully recover a broken streak using a token",
      icon: "❤️‍🔥",
      xpReward: 200,
      coinReward: 40,
      unlocked: false,
      claimed: false,
    },
  ]);

  // ── Fetch profile from Firestore via backend on auth change ───────────────
  useEffect(() => {
    if (loading) return; // Wait until Auth finishes restoring session

    if (!user?.uid) {
      setXp(0);
      setCoins(0);
      setRecoveryTokens(2);
      setIsLoaded(false);
      return;
    }

    let cancelled = false;

    const fetchProfile = async () => {
      try {
        const activeToken = (await getIdToken()) || token;
        const profile = await api.get<UserProfile>("/api/v1/user/profile", activeToken);
        if (cancelled) return;
        setXp(profile.xp ?? 0);
        setCoins(profile.coins ?? 0);
        setRecoveryTokens(profile.recoveryTokens ?? 2);
        setIsLoaded(true);
      } catch (err) {
        console.error("[GamificationContext] Failed to fetch profile:", err);
        if (!cancelled) setIsLoaded(true);
      }
    };

    fetchProfile();
    return () => { cancelled = true; };
  }, [user?.uid, loading, token, getIdToken]);

  // ── Persist helper — fire-and-forget, non-blocking ────────────────────────
  const persistProfile = useCallback(
    async (updates: Record<string, number>) => {
      const activeToken = (await getIdToken()) || token;
      if (!activeToken) return;
      api.put("/api/v1/user/profile", activeToken, updates as Record<string, unknown>).catch((err) =>
        console.error("[GamificationContext] Failed to persist profile:", err)
      );
    },
    [token, getIdToken]
  );

  // ── addXP — updates local state and persists ──────────────────────────────
  const addXP = useCallback(
    (amount: number) => {
      setXp((prevXp) => {
        const newXp = prevXp + amount;
        const prevLevel = calculateLevel(prevXp);
        const newLevel = calculateLevel(newXp);

        if (newLevel > prevLevel) {
          setRecentLevelUp(newLevel);
          // Level-up bonus: +50 coins, +1 recovery token
          setCoins((prevCoins) => {
            const newCoins = prevCoins + 50;
            setRecoveryTokens((prevTokens) => {
              const newTokens = prevTokens + 1;
              persistProfile({ xp: newXp, level: newLevel, coins: newCoins, recoveryTokens: newTokens });
              return newTokens;
            });
            return newCoins;
          });
        } else {
          persistProfile({ xp: newXp, level: newLevel });
        }

        return newXp;
      });
    },
    [persistProfile]
  );

  // ── addCoins ──────────────────────────────────────────────────────────────
  const addCoins = useCallback(
    (amount: number) => {
      setCoins((prev) => {
        const newCoins = prev + amount;
        persistProfile({ coins: newCoins });
        return newCoins;
      });
    },
    [persistProfile]
  );

  // ── buyRecoveryToken (costs 50 coins) ─────────────────────────────────────
  const buyRecoveryToken = useCallback((): boolean => {
    const TOKEN_PRICE = 50;
    let success = false;
    setCoins((prevCoins) => {
      if (prevCoins < TOKEN_PRICE) return prevCoins;
      success = true;
      const newCoins = prevCoins - TOKEN_PRICE;
      setRecoveryTokens((prevTokens) => {
        const newTokens = prevTokens + 1;
        persistProfile({ coins: newCoins, recoveryTokens: newTokens });
        return newTokens;
      });
      return newCoins;
    });
    return success;
  }, [persistProfile]);

  // ── useRecoveryToken ──────────────────────────────────────────────────────
  const useRecoveryToken = useCallback((): boolean => {
    let success = false;
    setRecoveryTokens((prev) => {
      if (prev <= 0) return prev;
      success = true;
      const newTokens = prev - 1;
      persistProfile({ recoveryTokens: newTokens });
      setAchievements((prevAch) =>
        prevAch.map((a) => (a.code === "STREAK_RECOVERY" ? { ...a, unlocked: true } : a))
      );
      return newTokens;
    });
    return success;
  }, [persistProfile]);

  // ── claimAchievement ──────────────────────────────────────────────────────
  const claimAchievement = useCallback(
    (id: string) => {
      setAchievements((prev) =>
        prev.map((a) => {
          if (a.id === id && a.unlocked && !a.claimed) {
            addXP(a.xpReward);
            addCoins(a.coinReward);
            return { ...a, claimed: true };
          }
          return a;
        })
      );
    },
    [addXP, addCoins]
  );

  const clearLevelUpBanner = useCallback(() => setRecentLevelUp(null), []);

  return (
    <GamificationContext.Provider
      value={{
        xp,
        level,
        coins,
        recoveryTokens,
        achievements,
        isLoaded,
        addXP,
        addCoins,
        buyRecoveryToken,
        useRecoveryToken,
        claimAchievement,
        recentLevelUp,
        clearLevelUpBanner,
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
};

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error("useGamification must be used within GamificationProvider");
  }
  return context;
};
