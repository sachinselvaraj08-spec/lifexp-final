"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { useGamification } from "../../context/GamificationContext";

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { xp, level, coins, recoveryTokens } = useGamification();

  const xpInCurrentLevel = xp % 250;
  const nextLevelXp = 250;
  const xpPercentage = Math.min(100, Math.round((xpInCurrentLevel / nextLevelXp) * 100));

  return (
    <header style={headerStyle}>
      {/* Level & XP Bar Container */}
      <div style={statsGroupStyle}>
        <div style={badgeStyle}>LVL {level}</div>

        <div style={xpContainerStyle} title={`${xpInCurrentLevel} / ${nextLevelXp} XP (Total: ${xp})`}>
          <div style={{ ...xpFillStyle, width: `${xpPercentage}%` }} />
          <span style={xpTextStyle}>
            {xpInCurrentLevel} / {nextLevelXp} XP
          </span>
        </div>

        {/* Coins Counter */}
        <div style={statPillStyle} title="Coins Balance">
          <span style={pillIconStyle}>🪙</span>
          <span style={pillValueStyle}>{coins}</span>
        </div>

        {/* Recovery Tokens Counter */}
        <div style={{ ...statPillStyle, borderColor: "#F59E0B" }} title="Streak Recovery Tokens">
          <span style={pillIconStyle}>❤️‍🔥</span>
          <span style={{ ...pillValueStyle, color: "#F59E0B" }}>{recoveryTokens}</span>
        </div>
      </div>

      {/* User Actions */}
      <div style={userGroupStyle}>
        <Link href="/profile" style={profileLinkStyle}>
          {user?.photoURL ? (
            <img src={user.photoURL} alt="Avatar" style={avatarStyle} />
          ) : (
            <div style={avatarFallbackStyle}>
              {user?.displayName ? user.displayName.substring(0, 2).toUpperCase() : "XP"}
            </div>
          )}
          <span style={userNameStyle}>{user?.displayName || "Adventurer"}</span>
        </Link>

        <button onClick={logout} style={logoutButtonStyle} title="Log Out">
          🚪 Exit
        </button>
      </div>
    </header>
  );
};

const headerStyle: React.CSSProperties = {
  height: "64px",
  backgroundColor: "#1E293B",
  borderBottom: "2px solid #334155",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0 24px",
  flexShrink: 0,
};

const statsGroupStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
};

const badgeStyle: React.CSSProperties = {
  backgroundColor: "#F59E0B",
  color: "#0F172A",
  fontWeight: "900",
  fontSize: "0.85rem",
  padding: "4px 10px",
  borderRadius: "6px",
  boxShadow: "2px 2px 0px #000",
  letterSpacing: "0.05em",
};

const xpContainerStyle: React.CSSProperties = {
  width: "180px",
  height: "22px",
  backgroundColor: "#0F172A",
  borderRadius: "12px",
  border: "1px solid #475569",
  position: "relative",
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const xpFillStyle: React.CSSProperties = {
  position: "absolute",
  left: 0,
  top: 0,
  bottom: 0,
  backgroundColor: "#F59E0B",
  borderRadius: "12px",
  transition: "width 0.3s ease",
};

const xpTextStyle: React.CSSProperties = {
  position: "relative",
  zIndex: 1,
  fontSize: "0.75rem",
  fontWeight: "700",
  color: "#F8FAFC",
  textShadow: "0px 1px 2px rgba(0,0,0,0.8)",
};

const statPillStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  padding: "4px 12px",
  backgroundColor: "#0F172A",
  border: "1px solid #334155",
  borderRadius: "16px",
};

const pillIconStyle: React.CSSProperties = {
  fontSize: "0.95rem",
};

const pillValueStyle: React.CSSProperties = {
  fontSize: "0.85rem",
  fontWeight: "800",
  color: "#F59E0B",
};

const userGroupStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
};

const profileLinkStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  textDecoration: "none",
  color: "#F8FAFC",
};

const avatarStyle: React.CSSProperties = {
  width: "36px",
  height: "36px",
  borderRadius: "50%",
  border: "2px solid #F59E0B",
};

const avatarFallbackStyle: React.CSSProperties = {
  width: "36px",
  height: "36px",
  borderRadius: "50%",
  backgroundColor: "#334155",
  border: "2px solid #F59E0B",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontWeight: "800",
  fontSize: "0.85rem",
  color: "#F59E0B",
};

const userNameStyle: React.CSSProperties = {
  fontWeight: "700",
  fontSize: "0.9rem",
};

const logoutButtonStyle: React.CSSProperties = {
  padding: "6px 12px",
  backgroundColor: "#334155",
  border: "1px solid #475569",
  borderRadius: "6px",
  color: "#F8FAFC",
  fontWeight: "600",
  fontSize: "0.85rem",
  cursor: "pointer",
  transition: "all 0.15s ease",
};
