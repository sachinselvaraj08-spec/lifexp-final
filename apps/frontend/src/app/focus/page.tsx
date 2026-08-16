"use client";

import React, { useState, useEffect } from "react";
import { ProtectedRoute } from "../../components/layout/ProtectedRoute";
import { Sidebar } from "../../components/layout/Sidebar";
import { Header } from "../../components/layout/Header";
import { MobileNav } from "../../components/layout/MobileNav";
import { useGamification } from "../../context/GamificationContext";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";

export default function FocusPage() {
  const { addXP, addCoins } = useGamification();
  const { token } = useAuth();

  // Modes: 25m Pomodoro (1500s), 50m Deep Work (3000s), 5m Short Break (300s)
  const [timerMode, setTimerMode] = useState<"pomodoro" | "deep" | "shortBreak">("pomodoro");
  const [timeLeft, setTimeLeft] = useState(1500);
  const [isRunning, setIsRunning] = useState(false);
  const [ambientSound, setAmbientSound] = useState<"none" | "rain" | "lofi">("none");

  // Focus Stats — initialized to 0, hydrated from Firestore
  const [todayFocusMinutes, setTodayFocusMinutes] = useState(0);
  const [completedSessions, setCompletedSessions] = useState(0);

  // Fetch today's daily progress from Firestore on mount
  useEffect(() => {
    if (!token) return;
    api
      .get<{ totalFocusMinutes: number; completedSessions: number }>(
        "/api/v1/focus/daily",
        token
      )
      .then((data) => {
        setTodayFocusMinutes(data.totalFocusMinutes ?? 0);
        setCompletedSessions(data.completedSessions ?? 0);
      })
      .catch((err) => console.error("[FocusPage] Failed to fetch daily progress:", err));
  }, [token]);

  // Timer Tick Logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      // Award Gamification Rewards
      const earnedXP = timerMode === "pomodoro" ? 60 : timerMode === "deep" ? 120 : 15;
      const earnedCoins = timerMode === "pomodoro" ? 15 : timerMode === "deep" ? 35 : 5;
      const durationMins = timerMode === "pomodoro" ? 25 : timerMode === "deep" ? 50 : 5;

      addXP(earnedXP, "Completed Focus Session");
      addCoins(earnedCoins);

      setTodayFocusMinutes((prev) => prev + durationMins);
      setCompletedSessions((prev) => prev + 1);

      // Persist session to Firestore
      if (token) {
        api
          .post("/api/v1/focus/sessions", token, {
            mode: timerMode,
            durationMinutes: durationMins,
            xpEarned: earnedXP,
            coinsEarned: earnedCoins,
          })
          .catch((err) => console.error("[FocusPage] Failed to save session:", err));
      }

      alert(`🎉 Focus Session Completed! You earned +${earnedXP} XP and +${earnedCoins} Coins!`);
    }

    return () => { if (interval) clearInterval(interval); };
  }, [isRunning, timeLeft, timerMode, addXP, addCoins, token]);

  const switchMode = (mode: "pomodoro" | "deep" | "shortBreak") => {
    setIsRunning(false);
    setTimerMode(mode);
    if (mode === "pomodoro") setTimeLeft(1500);
    if (mode === "deep") setTimeLeft(3000);
    if (mode === "shortBreak") setTimeLeft(300);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    switchMode(timerMode);
  };

  return (
    <ProtectedRoute>
      <div style={layoutStyle} className="lifexp-layout">
        <MobileNav />
        <Sidebar />

        <div style={mainWrapperStyle}>
          <Header />

          <main style={contentStyle} className="lifexp-content">
            {/* Top Bar Header */}
            <div style={topBarStyle} className="page-top-bar">
              <div>
                <h1 style={pageTitleStyle}>⏱️ Focus Mode & Pomodoro</h1>
                <p style={pageSubtitleStyle}>
                  Enter deep focus, eliminate distractions, and earn XP for every minute completed.
                </p>
              </div>
            </div>

            {/* Immersive Focus Timer Card */}
            <div
              style={{
                ...timerCardStyle,
                borderColor: isRunning ? "#F43F5E" : "#334155",
              }}
              className="focus-timer-card"
            >
              {/* Mode Switcher Tabs */}
              <div style={modeGroupStyle} className="focus-mode-tabs">
                <button
                  onClick={() => switchMode("pomodoro")}
                  style={{
                    ...modeButtonStyle,
                    backgroundColor: timerMode === "pomodoro" ? "#F43F5E" : "transparent",
                    color: timerMode === "pomodoro" ? "#FFFFFF" : "#CBD5E1",
                  }}
                >
                  25m Pomodoro
                </button>
                <button
                  onClick={() => switchMode("deep")}
                  style={{
                    ...modeButtonStyle,
                    backgroundColor: timerMode === "deep" ? "#F43F5E" : "transparent",
                    color: timerMode === "deep" ? "#FFFFFF" : "#CBD5E1",
                  }}
                >
                  50m Deep Work
                </button>
                <button
                  onClick={() => switchMode("shortBreak")}
                  style={{
                    ...modeButtonStyle,
                    backgroundColor: timerMode === "shortBreak" ? "#10B981" : "transparent",
                    color: timerMode === "shortBreak" ? "#0F172A" : "#CBD5E1",
                  }}
                >
                  5m Short Break
                </button>
              </div>

              {/* Countdown Clock Display */}
              <div style={clockDisplayStyle} className="focus-clock">{formatTime(timeLeft)}</div>

              {/* Timer Control Buttons */}
              <div style={controlsRowStyle} className="focus-controls-row">
                <button
                  onClick={toggleTimer}
                  style={{
                    ...mainActionButtonStyle,
                    backgroundColor: isRunning ? "#E11D48" : "#F43F5E",
                  }}
                >
                  {isRunning ? "⏸️ Pause Session" : "▶️ Start Focus Session"}
                </button>
                <button onClick={resetTimer} style={secondaryButtonStyle}>
                  🔄 Reset
                </button>
              </div>

              <div style={rewardNoticeStyle}>
                Reward: {timerMode === "pomodoro" ? "+60 XP, +15 Coins" : timerMode === "deep" ? "+120 XP, +35 Coins" : "+15 XP, +5 Coins"}
              </div>
            </div>

            {/* Ambient Sound & Distraction Shield Controls */}
            <div style={gridTwoColStyle} className="grid-2col">
              <div style={cardStyle}>
                <h2 style={cardTitleStyle}>🎧 Ambient Soundscapes</h2>
                <div style={ambientOptionsStyle}>
                  <button
                    onClick={() => setAmbientSound("none")}
                    style={{
                      ...ambientButtonStyle,
                      borderColor: ambientSound === "none" ? "#F59E0B" : "#334155",
                    }}
                  >
                    🔇 Silent Focus
                  </button>
                  <button
                    onClick={() => setAmbientSound("rain")}
                    style={{
                      ...ambientButtonStyle,
                      borderColor: ambientSound === "rain" ? "#F59E0B" : "#334155",
                    }}
                  >
                    🌧️ Gentle Rain
                  </button>
                  <button
                    onClick={() => setAmbientSound("lofi")}
                    style={{
                      ...ambientButtonStyle,
                      borderColor: ambientSound === "lofi" ? "#F59E0B" : "#334155",
                    }}
                  >
                    🎵 Lofi Beats
                  </button>
                </div>
              </div>

              {/* Focus Statistics Card */}
              <div style={cardStyle}>
                <h2 style={cardTitleStyle}>📊 Focus Statistics</h2>
                <div style={statsListStyle}>
                  <div style={statRowStyle}>
                    <span style={statLabelStyle}>Focus Time Today:</span>
                    <span style={statValueStyle}>{todayFocusMinutes} mins</span>
                  </div>
                  <div style={statRowStyle}>
                    <span style={statLabelStyle}>Sessions Completed:</span>
                    <span style={statValueStyle}>{completedSessions} sessions</span>
                  </div>
                  <div style={statRowStyle}>
                    <span style={statLabelStyle}>Distraction Shield Status:</span>
                    <span style={{ ...statValueStyle, color: "#10B981" }}>🛡️ Active</span>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

const layoutStyle: React.CSSProperties = {
  display: "flex",
  minHeight: "100vh",
  backgroundColor: "#0F172A",
  color: "#F8FAFC",
  fontFamily: "Inter, system-ui, sans-serif",
};

const mainWrapperStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  flex: 1,
  overflowX: "hidden",
};

const contentStyle: React.CSSProperties = {
  padding: "24px 32px",
  display: "flex",
  flexDirection: "column",
  gap: "24px",
};

const topBarStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const pageTitleStyle: React.CSSProperties = {
  fontSize: "1.8rem",
  fontWeight: "800",
  margin: "0 0 4px 0",
};

const pageSubtitleStyle: React.CSSProperties = {
  color: "#94A3B8",
  margin: 0,
  fontSize: "0.95rem",
};

const timerCardStyle: React.CSSProperties = {
  backgroundColor: "#1E293B",
  border: "2px solid #334155",
  borderRadius: "16px",
  padding: "40px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  boxShadow: "6px 6px 0px #000",
  gap: "24px",
  transition: "border-color 0.3s ease",
};

const modeGroupStyle: React.CSSProperties = {
  display: "flex",
  backgroundColor: "#0F172A",
  borderRadius: "8px",
  padding: "4px",
  border: "1px solid #334155",
};

const modeButtonStyle: React.CSSProperties = {
  padding: "10px 20px",
  border: "none",
  borderRadius: "6px",
  fontWeight: "800",
  fontSize: "0.9rem",
  cursor: "pointer",
  transition: "all 0.15s ease",
};

const clockDisplayStyle: React.CSSProperties = {
  fontSize: "6rem",
  fontWeight: "900",
  fontFamily: "monospace",
  letterSpacing: "0.05em",
  color: "#F43F5E",
  margin: "12px 0",
  textShadow: "0 2px 10px rgba(244, 63, 94, 0.3)",
};

const controlsRowStyle: React.CSSProperties = {
  display: "flex",
  gap: "16px",
  alignItems: "center",
};

const mainActionButtonStyle: React.CSSProperties = {
  padding: "14px 28px",
  color: "#FFFFFF",
  fontWeight: "900",
  fontSize: "1.1rem",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  boxShadow: "3px 3px 0px #000",
};

const secondaryButtonStyle: React.CSSProperties = {
  padding: "14px 20px",
  backgroundColor: "#334155",
  color: "#F8FAFC",
  fontWeight: "700",
  fontSize: "1rem",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

const rewardNoticeStyle: React.CSSProperties = {
  fontSize: "0.9rem",
  fontWeight: "700",
  color: "#F59E0B",
  backgroundColor: "#0F172A",
  padding: "6px 16px",
  borderRadius: "20px",
  border: "1px solid #334155",
};

const gridTwoColStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "24px",
};

const cardStyle: React.CSSProperties = {
  backgroundColor: "#1E293B",
  border: "2px solid #334155",
  borderRadius: "12px",
  padding: "24px",
  boxShadow: "4px 4px 0px #000",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
};

const cardTitleStyle: React.CSSProperties = {
  fontSize: "1.2rem",
  fontWeight: "800",
  margin: 0,
};

const ambientOptionsStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const ambientButtonStyle: React.CSSProperties = {
  padding: "12px 16px",
  backgroundColor: "#0F172A",
  border: "2px solid",
  borderRadius: "8px",
  color: "#F8FAFC",
  fontWeight: "700",
  fontSize: "0.95rem",
  cursor: "pointer",
  textAlign: "left",
};

const statsListStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "14px",
};

const statRowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  paddingBottom: "10px",
  borderBottom: "1px solid #334155",
};

const statLabelStyle: React.CSSProperties = {
  color: "#94A3B8",
  fontSize: "0.95rem",
  fontWeight: "600",
};

const statValueStyle: React.CSSProperties = {
  fontWeight: "800",
  fontSize: "1rem",
  color: "#F8FAFC",
};
