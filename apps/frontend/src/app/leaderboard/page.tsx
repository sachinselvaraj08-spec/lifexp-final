"use client";

import React, { useState } from "react";
import { ProtectedRoute } from "../../components/layout/ProtectedRoute";
import { Sidebar } from "../../components/layout/Sidebar";
import { Header } from "../../components/layout/Header";

export default function LeaderboardPage() {
  const [leagueTab, setLeagueTab] = useState<"global" | "college" | "friends">("global");

  const globalRankings = [
    { rank: 1, name: "Alex Rivera", level: 24, xp: 8450, streak: 45, change: "▲ 1", college: "MIT" },
    { rank: 2, name: "Sarah Chen", level: 22, xp: 7920, streak: 32, change: "▼ 1", college: "Stanford" },
    { rank: 3, name: "Marcus Vance", level: 20, xp: 6810, streak: 28, change: "▲ 3", college: "Harvard" },
    { rank: 4, name: "You (Adventurer)", level: 14, xp: 3760, streak: 12, change: "▲ 2", college: "Tech Guild", isUser: true },
    { rank: 5, name: "Elena Rostova", level: 13, xp: 3540, streak: 10, change: "▼ 1", college: "Oxford" },
    { rank: 6, name: "David Kim", level: 12, xp: 3200, streak: 8, change: "▲ 1", college: "Berkeley" },
  ];

  return (
    <ProtectedRoute>
      <div style={layoutStyle}>
        <Sidebar />

        <div style={mainWrapperStyle}>
          <Header />

          <main style={contentStyle}>
            {/* Top Bar Header */}
            <div style={topBarStyle}>
              <div>
                <h1 style={pageTitleStyle}>🏆 Global & College Leaderboards</h1>
                <p style={pageSubtitleStyle}>
                  Compete with productivity warriors worldwide, your college peers, and friends.
                </p>
              </div>

              {/* League Tabs */}
              <div style={tabGroupStyle}>
                <button
                  onClick={() => setLeagueTab("global")}
                  style={{
                    ...tabButtonStyle,
                    backgroundColor: leagueTab === "global" ? "#F59E0B" : "transparent",
                    color: leagueTab === "global" ? "#0F172A" : "#CBD5E1",
                  }}
                >
                  🌐 Global Rankings
                </button>
                <button
                  onClick={() => setLeagueTab("college")}
                  style={{
                    ...tabButtonStyle,
                    backgroundColor: leagueTab === "college" ? "#F59E0B" : "transparent",
                    color: leagueTab === "college" ? "#0F172A" : "#CBD5E1",
                  }}
                >
                  🎓 College League
                </button>
                <button
                  onClick={() => setLeagueTab("friends")}
                  style={{
                    ...tabButtonStyle,
                    backgroundColor: leagueTab === "friends" ? "#F59E0B" : "transparent",
                    color: leagueTab === "friends" ? "#0F172A" : "#CBD5E1",
                  }}
                >
                  👥 Friends Circle
                </button>
              </div>
            </div>

            {/* Top 3 Podium Card */}
            <div style={podiumContainerStyle}>
              {/* Rank 2 */}
              <div style={podiumCardStyle}>
                <span style={podiumRankBadgeStyle}>#2</span>
                <div style={podiumAvatarStyle}>🥈</div>
                <div style={podiumNameStyle}>{globalRankings[1].name}</div>
                <div style={podiumXpStyle}>{globalRankings[1].xp} XP</div>
              </div>

              {/* Rank 1 */}
              <div style={{ ...podiumCardStyle, borderColor: "#F59E0B", transform: "scale(1.05)" }}>
                <span style={{ ...podiumRankBadgeStyle, backgroundColor: "#F59E0B" }}>#1</span>
                <div style={podiumAvatarStyle}>👑</div>
                <div style={podiumNameStyle}>{globalRankings[0].name}</div>
                <div style={{ ...podiumXpStyle, color: "#F59E0B" }}>{globalRankings[0].xp} XP</div>
              </div>

              {/* Rank 3 */}
              <div style={podiumCardStyle}>
                <span style={podiumRankBadgeStyle}>#3</span>
                <div style={podiumAvatarStyle}>🥉</div>
                <div style={podiumNameStyle}>{globalRankings[2].name}</div>
                <div style={podiumXpStyle}>{globalRankings[2].xp} XP</div>
              </div>
            </div>

            {/* Leaderboard Table */}
            <div style={cardStyle}>
              <div style={tableWrapperStyle}>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Rank</th>
                      <th style={{ ...thStyle, textAlign: "left" }}>User</th>
                      <th style={thStyle}>College / Guild</th>
                      <th style={thStyle}>Level</th>
                      <th style={thStyle}>Streak</th>
                      <th style={thStyle}>Total XP</th>
                      <th style={thStyle}>Movement</th>
                    </tr>
                  </thead>
                  <tbody>
                    {globalRankings.map((user) => (
                      <tr
                        key={user.rank}
                        style={{
                          ...trStyle,
                          backgroundColor: user.isUser ? "#F59E0B15" : "transparent",
                          borderLeft: user.isUser ? "4px solid #F59E0B" : "none",
                        }}
                      >
                        <td style={{ ...tdStyle, fontWeight: "900", fontSize: "1.1rem" }}>
                          #{user.rank}
                        </td>
                        <td style={{ ...tdStyle, textAlign: "left", fontWeight: "700" }}>
                          {user.name} {user.isUser && "⭐ (You)"}
                        </td>
                        <td style={tdStyle}>
                          <span style={collegeBadgeStyle}>🎓 {user.college}</span>
                        </td>
                        <td style={tdStyle}>
                          <span style={lvlPillStyle}>LVL {user.level}</span>
                        </td>
                        <td style={{ ...tdStyle, color: "#EF4444", fontWeight: "800" }}>
                          🔥 {user.streak}d
                        </td>
                        <td style={{ ...tdStyle, color: "#F59E0B", fontWeight: "900" }}>
                          {user.xp} XP
                        </td>
                        <td style={{ ...tdStyle, fontWeight: "700", color: user.change.includes("▲") ? "#10B981" : "#EF4444" }}>
                          {user.change}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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

const tabGroupStyle: React.CSSProperties = {
  display: "flex",
  backgroundColor: "#1E293B",
  borderRadius: "8px",
  padding: "4px",
  border: "1px solid #334155",
};

const tabButtonStyle: React.CSSProperties = {
  padding: "8px 16px",
  border: "none",
  borderRadius: "6px",
  fontWeight: "700",
  fontSize: "0.85rem",
  cursor: "pointer",
  transition: "all 0.15s ease",
};

const podiumContainerStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1.1fr 1fr",
  gap: "16px",
  alignItems: "flex-end",
};

const podiumCardStyle: React.CSSProperties = {
  backgroundColor: "#1E293B",
  border: "2px solid #334155",
  borderRadius: "12px",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  boxShadow: "4px 4px 0px #000",
  gap: "8px",
  position: "relative",
};

const podiumRankBadgeStyle: React.CSSProperties = {
  position: "absolute",
  top: "-12px",
  backgroundColor: "#334155",
  color: "#F8FAFC",
  fontWeight: "900",
  fontSize: "0.8rem",
  padding: "2px 10px",
  borderRadius: "10px",
  border: "1px solid #475569",
};

const podiumAvatarStyle: React.CSSProperties = {
  fontSize: "2.5rem",
};

const podiumNameStyle: React.CSSProperties = {
  fontWeight: "800",
  fontSize: "1rem",
};

const podiumXpStyle: React.CSSProperties = {
  fontWeight: "900",
  color: "#CBD5E1",
};

const cardStyle: React.CSSProperties = {
  backgroundColor: "#1E293B",
  border: "2px solid #334155",
  borderRadius: "12px",
  padding: "20px",
  boxShadow: "4px 4px 0px #000",
};

const tableWrapperStyle: React.CSSProperties = {
  overflowX: "auto",
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
};

const thStyle: React.CSSProperties = {
  padding: "12px 16px",
  backgroundColor: "#0F172A",
  borderBottom: "2px solid #334155",
  fontSize: "0.85rem",
  fontWeight: "800",
  textAlign: "center",
  color: "#CBD5E1",
};

const trStyle: React.CSSProperties = {
  borderBottom: "1px solid #334155",
};

const tdStyle: React.CSSProperties = {
  padding: "14px 16px",
  fontSize: "0.9rem",
  textAlign: "center",
  color: "#F8FAFC",
};

const collegeBadgeStyle: React.CSSProperties = {
  padding: "2px 8px",
  backgroundColor: "#0F172A",
  borderRadius: "4px",
  fontSize: "0.75rem",
  color: "#94A3B8",
  border: "1px solid #334155",
};

const lvlPillStyle: React.CSSProperties = {
  padding: "2px 8px",
  backgroundColor: "#334155",
  borderRadius: "4px",
  fontSize: "0.75rem",
  fontWeight: "800",
  color: "#F59E0B",
};
