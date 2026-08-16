"use client";

import React, { useState } from "react";
import { ProtectedRoute } from "../../components/layout/ProtectedRoute";
import { Sidebar } from "../../components/layout/Sidebar";
import { Header } from "../../components/layout/Header";
import { MobileNav } from "../../components/layout/MobileNav";
import { useAuth } from "../../context/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();
  const [title, setTitle] = useState("Habit Architect");
  const [bio, setBio] = useState("Leveling up every day through focus and discipline.");
  const [isEditing, setIsEditing] = useState(false);

  const achievements = [
    { id: "1", title: "First Step", desc: "Completed your first habit", icon: "🌱", unlocked: true, date: "Jun 20, 2026" },
    { id: "2", title: "Streak Master I", desc: "Maintained a 7-day streak", icon: "🔥", unlocked: true, date: "Jul 01, 2026" },
    { id: "3", title: "Focus Initiate", desc: "Accumulated 5 hours of deep focus", icon: "🎯", unlocked: true, date: "Jul 10, 2026" },
    { id: "4", title: "Century Club", desc: "Log 100 total habit completions", icon: "💯", unlocked: false, date: "Locked" },
    { id: "5", title: "AI Scholar", desc: "Receive 10 weekly reviews from AI Coach", icon: "🤖", unlocked: false, date: "Locked" },
    { id: "6", title: "Gold Vault", desc: "Earn 1,000 total gold coins", icon: "💰", unlocked: false, date: "Locked" },
  ];

  return (
    <ProtectedRoute>
      <div style={layoutStyle} className="lifexp-layout">
        <MobileNav />
        <Sidebar />

        <div style={mainWrapperStyle}>
          <Header />

          <main style={contentStyle} className="lifexp-content">
            {/* Profile Overview Card */}
            <div style={cardStyle}>
              <div style={profileHeaderStyle} className="profile-header-inner">
                <div style={avatarWrapperStyle}>
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="Avatar" style={avatarStyle} />
                  ) : (
                    <div style={avatarFallbackStyle}>
                      {user?.displayName ? user.displayName.substring(0, 2).toUpperCase() : "XP"}
                    </div>
                  )}
                  <div style={levelTagStyle}>LVL 14</div>
                </div>

                <div style={profileInfoStyle} className="profile-info-section">
                  <div style={titleRowStyle} className="profile-title-row">
                    <h1 style={userNameStyle}>{user?.displayName || "Adventurer"}</h1>
                    <span style={titleBadgeStyle}>{title}</span>
                  </div>
                  <p style={emailStyle}>{user?.email}</p>
                  <p style={bioStyle}>"{bio}"</p>

                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    style={editButtonStyle}
                    className="profile-edit-btn"
                  >
                    {isEditing ? "Save Profile" : "✏️ Edit Profile"}
                  </button>
                </div>
              </div>

              {isEditing && (
                <div style={editFormStyle} className="profile-edit-form">
                  <div style={inputGroupStyle}>
                    <label style={labelStyle}>Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                  <div style={inputGroupStyle}>
                    <label style={labelStyle}>Bio</label>
                    <input
                      type="text"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* User Statistics Grid */}
            <div style={statsGridStyle} className="profile-stats-grid">
              <div style={statCardStyle}>
                <span style={statIconStyle}>⚡</span>
                <div>
                  <div style={statValueStyle}>14</div>
                  <div style={statLabelStyle}>Current Level</div>
                </div>
              </div>

              <div style={statCardStyle}>
                <span style={statIconStyle}>✨</span>
                <div>
                  <div style={statValueStyle}>3,760</div>
                  <div style={statLabelStyle}>Total XP Earned</div>
                </div>
              </div>

              <div style={statCardStyle}>
                <span style={statIconStyle}>🪙</span>
                <div>
                  <div style={statValueStyle}>240</div>
                  <div style={statLabelStyle}>Coins Balance</div>
                </div>
              </div>

              <div style={statCardStyle}>
                <span style={statIconStyle}>🔥</span>
                <div>
                  <div style={statValueStyle}>12 Days</div>
                  <div style={statLabelStyle}>Active Streak</div>
                </div>
              </div>
            </div>

            {/* Achievements Showcase */}
            <div style={cardStyle}>
              <h2 style={sectionTitleStyle}>🏆 Achievements & Badges</h2>
              <div style={achievementGridStyle} className="achievement-grid">
                {achievements.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      ...achievementCardStyle,
                      opacity: item.unlocked ? 1 : 0.5,
                      borderColor: item.unlocked ? "#F59E0B" : "#334155",
                    }}
                  >
                    <span style={achievementIconStyle}>{item.icon}</span>
                    <div>
                      <div style={achievementTitleStyle}>{item.title}</div>
                      <div style={achievementDescStyle}>{item.desc}</div>
                      <div style={achievementDateStyle}>
                        {item.unlocked ? `Unlocked ${item.date}` : "🔒 Locked"}
                      </div>
                    </div>
                  </div>
                ))}
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

const cardStyle: React.CSSProperties = {
  backgroundColor: "#1E293B",
  border: "2px solid #334155",
  borderRadius: "12px",
  padding: "28px",
  boxShadow: "4px 4px 0px #000",
};

const profileHeaderStyle: React.CSSProperties = {
  display: "flex",
  gap: "24px",
  alignItems: "flex-start",
};

const avatarWrapperStyle: React.CSSProperties = {
  position: "relative",
};

const avatarStyle: React.CSSProperties = {
  width: "90px",
  height: "90px",
  borderRadius: "50%",
  border: "3px solid #F59E0B",
};

const avatarFallbackStyle: React.CSSProperties = {
  width: "90px",
  height: "90px",
  borderRadius: "50%",
  backgroundColor: "#0F172A",
  border: "3px solid #F59E0B",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "2rem",
  fontWeight: "900",
  color: "#F59E0B",
};

const levelTagStyle: React.CSSProperties = {
  position: "absolute",
  bottom: "-6px",
  right: "0px",
  backgroundColor: "#F59E0B",
  color: "#0F172A",
  fontWeight: "900",
  fontSize: "0.75rem",
  padding: "2px 8px",
  borderRadius: "10px",
  boxShadow: "1px 1px 0px #000",
};

const profileInfoStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "6px",
  flex: 1,
};

const titleRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const userNameStyle: React.CSSProperties = {
  fontSize: "1.8rem",
  fontWeight: "800",
  margin: 0,
};

const titleBadgeStyle: React.CSSProperties = {
  padding: "4px 10px",
  backgroundColor: "#334155",
  borderRadius: "6px",
  fontSize: "0.85rem",
  fontWeight: "700",
  color: "#F59E0B",
  border: "1px solid #475569",
};

const emailStyle: React.CSSProperties = {
  color: "#94A3B8",
  margin: 0,
  fontSize: "0.9rem",
};

const bioStyle: React.CSSProperties = {
  color: "#CBD5E1",
  margin: "6px 0 12px 0",
  fontSize: "0.95rem",
  fontStyle: "italic",
};

const editButtonStyle: React.CSSProperties = {
  alignSelf: "flex-start",
  padding: "8px 16px",
  backgroundColor: "#334155",
  border: "1px solid #475569",
  borderRadius: "6px",
  color: "#F8FAFC",
  fontWeight: "600",
  fontSize: "0.85rem",
  cursor: "pointer",
};

const editFormStyle: React.CSSProperties = {
  marginTop: "20px",
  paddingTop: "20px",
  borderTop: "1px solid #334155",
  display: "flex",
  gap: "16px",
};

const inputGroupStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  flex: 1,
};

const labelStyle: React.CSSProperties = {
  fontSize: "0.8rem",
  fontWeight: "700",
  color: "#94A3B8",
};

const inputStyle: React.CSSProperties = {
  padding: "10px 14px",
  backgroundColor: "#0F172A",
  border: "1px solid #475569",
  borderRadius: "6px",
  color: "#F8FAFC",
  fontSize: "0.9rem",
  outline: "none",
};

const statsGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "16px",
};

const statCardStyle: React.CSSProperties = {
  backgroundColor: "#1E293B",
  border: "2px solid #334155",
  borderRadius: "10px",
  padding: "18px",
  display: "flex",
  alignItems: "center",
  gap: "14px",
  boxShadow: "3px 3px 0px #000",
};

const statIconStyle: React.CSSProperties = {
  fontSize: "1.8rem",
};

const statValueStyle: React.CSSProperties = {
  fontSize: "1.3rem",
  fontWeight: "900",
  color: "#F8FAFC",
};

const statLabelStyle: React.CSSProperties = {
  fontSize: "0.8rem",
  color: "#94A3B8",
  fontWeight: "600",
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: "1.3rem",
  fontWeight: "800",
  margin: "0 0 20px 0",
};

const achievementGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "16px",
};

const achievementCardStyle: React.CSSProperties = {
  backgroundColor: "#0F172A",
  border: "2px solid",
  borderRadius: "10px",
  padding: "16px",
  display: "flex",
  alignItems: "flex-start",
  gap: "14px",
};

const achievementIconStyle: React.CSSProperties = {
  fontSize: "2rem",
};

const achievementTitleStyle: React.CSSProperties = {
  fontWeight: "800",
  fontSize: "0.95rem",
  color: "#F8FAFC",
};

const achievementDescStyle: React.CSSProperties = {
  fontSize: "0.8rem",
  color: "#94A3B8",
  margin: "4px 0",
};

const achievementDateStyle: React.CSSProperties = {
  fontSize: "0.75rem",
  fontWeight: "700",
  color: "#F59E0B",
};
