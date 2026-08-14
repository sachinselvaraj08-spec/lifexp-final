"use client";

import React, { createContext, useContext, useState } from "react";

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
  addXP: (amount: number, reason?: string) => void;
  addCoins: (amount: number) => void;
  buyRecoveryToken: () => boolean;
  useRecoveryToken: () => boolean;
  claimAchievement: (id: string) => void;
  recentLevelUp: number | null;
  clearLevelUpBanner: () => void;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export const GamificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [xp, setXp] = useState(3760);
  const [coins, setCoins] = useState(240);
  const [recoveryTokens, setRecoveryTokens] = useState(2);
  const [recentLevelUp, setRecentLevelUp] = useState<number | null>(null);

  const calculateLevel = (currentXp: number) => Math.floor(currentXp / 250) + 1;
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

  const addXP = (amount: number, reason?: string) => {
    setXp((prevXp) => {
      const newXp = prevXp + amount;
      const prevLevel = calculateLevel(prevXp);
      const newLevel = calculateLevel(newXp);
      if (newLevel > prevLevel) {
        setRecentLevelUp(newLevel);
        // Bonus reward on level up!
        setCoins((c) => c + 50);
        setRecoveryTokens((t) => t + 1);
      }
      return newXp;
    });
  };

  const addCoins = (amount: number) => {
    setCoins((prev) => prev + amount);
  };

  const buyRecoveryToken = (): boolean => {
    const TOKEN_PRICE = 50;
    if (coins >= TOKEN_PRICE) {
      setCoins((prev) => prev - TOKEN_PRICE);
      setRecoveryTokens((prev) => prev + 1);
      return true;
    }
    return false;
  };

  const useRecoveryToken = (): boolean => {
    if (recoveryTokens > 0) {
      setRecoveryTokens((prev) => prev - 1);
      // Unlock recovery achievement if not yet unlocked
      setAchievements((prev) =>
        prev.map((a) => (a.code === "STREAK_RECOVERY" ? { ...a, unlocked: true } : a))
      );
      return true;
    }
    return false;
  };

  const claimAchievement = (id: string) => {
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
  };

  const clearLevelUpBanner = () => {
    setRecentLevelUp(null);
  };

  return (
    <GamificationContext.Provider
      value={{
        xp,
        level,
        coins,
        recoveryTokens,
        achievements,
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
