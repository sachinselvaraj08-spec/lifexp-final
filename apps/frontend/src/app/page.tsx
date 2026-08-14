"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ProtectedRoute } from "../components/layout/ProtectedRoute";
import { Sidebar } from "../components/layout/Sidebar";
import { Header } from "../components/layout/Header";
import { useAuth } from "../context/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();

  // Mock State for Phase 1 Dashboard
  const [habits, setHabits] = useState([
    { id: "1", title: "Morning Workout / Gym Session", streak: 12, completed: true, xp: 50 },
    { id: "2", title: "Read 20 pages of a book", streak: 5, completed: false, xp: 30 },
    { id: "3", title: "Deep Work Focus Session (45m)", streak: 8, completed: false, xp: 60 },
    { id: "4", title: "Drink 3L of Water", streak: 14, completed: true, xp: 20 },
  ]);

  const toggleHabit = (id: string) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, completed: !h.completed } : h))
    );
  };

  const completedCount = habits.filter((h) => h.completed).length;

  return (
    <ProtectedRoute>
      <div style={layoutStyle}>
        <Sidebar />

        <div style={mainWrapperStyle}>
          <Header />

          <main style={contentStyle}>
            {/* Top Welcome Banner */}
            <div style={bannerStyle}>
              <div>
                <h1 style={bannerTitleStyle}>
                  Welcome back, {user?.displayName || "Adventurer"}! 👋
                </h1>
                <p style={bannerSubtitleStyle}>
                  You've completed {completedCount} of {habits.length} habits today. Keep the streak alive!
                </p>
              </div>
              <Link href="/habits" style={bannerButtonStyle}>
                + Add New Habit
              </Link>
            </div>

            {/* Dashboard Grid Layout */}
            <div style={gridStyle}>
              {/* Left Column: Daily Habits Today */}
              <div style={cardStyle}>
                <div style={cardHeaderStyle}>
                  <h2 style={cardTitleStyle}>📋 Today's Habits</h2>
                  <span style={countBadgeStyle}>
                    {completedCount}/{habits.length} Done
                  </span>
                </div>

                <div style={habitListStyle}>
                  {habits.map((habit) => (
                    <div
                      key={habit.id}
                      onClick={() => toggleHabit(habit.id)}
                      style={{
                        ...habitItemStyle,
                        backgroundColor: habit.completed ? "#0F172A" : "#1E293B",
                        borderColor: habit.completed ? "#10B981" : "#334155",
                      }}
                    >
                      <div style={checkboxWrapperStyle}>
                        <input
                          type="checkbox"
                          checked={habit.completed}
                          onChange={() => {}}
                          style={checkboxStyle}
                        />
                        <span
                          style={{
                            ...habitTextStyle,
                            textDecoration: habit.completed ? "line-through" : "none",
                            color: habit.completed ? "#94A3B8" : "#F8FAFC",
                          }}
                        >
                          {habit.title}
                        </span>
                      </div>

                      <div style={habitMetaStyle}>
                        <span style={streakPillStyle}>🔥 {habit.streak}d</span>
                        <span style={xpPillStyle}>+{habit.xp} XP</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Center Right Column: Quick Focus Timer Launcher */}
              <div style={cardStyle}>
                <div style={cardHeaderStyle}>
                  <h2 style={cardTitleStyle}>⏱️ Quick Focus Launcher</h2>
                </div>

                <div style={timerBoxStyle}>
                  <div style={timerDisplayStyle}>25:00</div>
                  <p style={timerSubtextStyle}>Pomodoro Deep Work Mode</p>

                  <Link href="/focus" style={startTimerButtonStyle}>
                    ▶ Start Focus Session (+60 XP)
                  </Link>
                </div>

                <div style={dividerStyle} />

                <div style={cardHeaderStyle}>
                  <h3 style={cardSubTitleStyle}>🤖 AI Coach Tip</h3>
                </div>
                <div style={tipBoxStyle}>
                  "Your focus sessions peak between 9 AM and 11 AM. Schedule your hardest habit first!"
                </div>
              </div>
            </div>

            {/* Bottom Row: Recent Level Ups & Achievements */}
            <div style={cardStyle}>
              <div style={cardHeaderStyle}>
                <h2 style={cardTitleStyle}>🏆 Recent Milestones & Badges</h2>
                <Link href="/profile" style={viewAllLinkStyle}>
                  View Profile & Badges →
                </Link>
              </div>

              <div style={milestoneGridStyle}>
                <div style={milestoneCardStyle}>
                  <span style={badgeIconStyle}>⚡</span>
                  <div>
                    <div style={milestoneTitleStyle}>Streak Master II</div>
                    <div style={milestoneDescStyle}>Maintained a 10-day consecutive streak</div>
                  </div>
                </div>

                <div style={milestoneCardStyle}>
                  <span style={badgeIconStyle}>🎯</span>
                  <div>
                    <div style={milestoneTitleStyle}>Focus Initiate</div>
                    <div style={milestoneDescStyle}>Completed 5 hours of total focus time</div>
                  </div>
                </div>

                <div style={milestoneCardStyle}>
                  <span style={badgeIconStyle}>👑</span>
                  <div>
                    <div style={milestoneTitleStyle}>Level 14 Reached</div>
                    <div style={milestoneDescStyle}>Unlocked new profile title: 'Habit Architect'</div>
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

const bannerStyle: React.CSSProperties = {
  backgroundColor: "#1E293B",
  border: "2px solid #334155",
  borderRadius: "12px",
  padding: "24px 32px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: "4px 4px 0px #000",
};

const bannerTitleStyle: React.CSSProperties = {
  fontSize: "1.8rem",
  fontWeight: "800",
  margin: "0 0 6px 0",
};

const bannerSubtitleStyle: React.CSSProperties = {
  color: "#94A3B8",
  margin: 0,
  fontSize: "0.95rem",
};

const bannerButtonStyle: React.CSSProperties = {
  padding: "12px 20px",
  backgroundColor: "#F59E0B",
  color: "#0F172A",
  fontWeight: "800",
  borderRadius: "8px",
  textDecoration: "none",
  boxShadow: "3px 3px 0px #000",
  fontSize: "0.95rem",
};

const gridStyle: React.CSSProperties = {
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

const cardHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const cardTitleStyle: React.CSSProperties = {
  fontSize: "1.2rem",
  fontWeight: "800",
  margin: 0,
};

const cardSubTitleStyle: React.CSSProperties = {
  fontSize: "1rem",
  fontWeight: "700",
  margin: 0,
  color: "#F59E0B",
};

const countBadgeStyle: React.CSSProperties = {
  padding: "4px 10px",
  backgroundColor: "#334155",
  borderRadius: "6px",
  fontSize: "0.85rem",
  fontWeight: "700",
  color: "#10B981",
};

const habitListStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const habitItemStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "14px 18px",
  borderRadius: "8px",
  border: "1px solid",
  cursor: "pointer",
  transition: "all 0.15s ease",
};

const checkboxWrapperStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const checkboxStyle: React.CSSProperties = {
  width: "18px",
  height: "18px",
  accentColor: "#10B981",
  cursor: "pointer",
};

const habitTextStyle: React.CSSProperties = {
  fontWeight: "600",
  fontSize: "0.95rem",
};

const habitMetaStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const streakPillStyle: React.CSSProperties = {
  fontSize: "0.75rem",
  fontWeight: "800",
  color: "#EF4444",
  backgroundColor: "#0F172A",
  padding: "4px 8px",
  borderRadius: "4px",
  border: "1px solid #334155",
};

const xpPillStyle: React.CSSProperties = {
  fontSize: "0.75rem",
  fontWeight: "800",
  color: "#F59E0B",
  backgroundColor: "#0F172A",
  padding: "4px 8px",
  borderRadius: "4px",
  border: "1px solid #334155",
};

const timerBoxStyle: React.CSSProperties = {
  backgroundColor: "#0F172A",
  borderRadius: "8px",
  padding: "20px",
  border: "1px solid #334155",
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const timerDisplayStyle: React.CSSProperties = {
  fontSize: "3rem",
  fontWeight: "900",
  letterSpacing: "0.05em",
  color: "#F43F5E",
};

const timerSubtextStyle: React.CSSProperties = {
  color: "#94A3B8",
  fontSize: "0.85rem",
  margin: "4px 0 16px 0",
};

const startTimerButtonStyle: React.CSSProperties = {
  padding: "10px 20px",
  backgroundColor: "#F43F5E",
  color: "#FFFFFF",
  fontWeight: "800",
  borderRadius: "6px",
  textDecoration: "none",
  boxShadow: "2px 2px 0px #000",
  fontSize: "0.9rem",
};

const dividerStyle: React.CSSProperties = {
  height: "1px",
  backgroundColor: "#334155",
  margin: "4px 0",
};

const tipBoxStyle: React.CSSProperties = {
  backgroundColor: "#0F172A",
  padding: "12px 16px",
  borderRadius: "8px",
  borderLeft: "4px solid #F59E0B",
  fontSize: "0.9rem",
  color: "#CBD5E1",
  fontStyle: "italic",
};

const viewAllLinkStyle: React.CSSProperties = {
  color: "#F59E0B",
  textDecoration: "none",
  fontWeight: "700",
  fontSize: "0.9rem",
};

const milestoneGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "16px",
};

const milestoneCardStyle: React.CSSProperties = {
  backgroundColor: "#0F172A",
  border: "1px solid #334155",
  borderRadius: "8px",
  padding: "16px",
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const badgeIconStyle: React.CSSProperties = {
  fontSize: "1.8rem",
};

const milestoneTitleStyle: React.CSSProperties = {
  fontWeight: "800",
  fontSize: "0.95rem",
  color: "#F8FAFC",
};

const milestoneDescStyle: React.CSSProperties = {
  fontSize: "0.8rem",
  color: "#94A3B8",
  marginTop: "2px",
};
