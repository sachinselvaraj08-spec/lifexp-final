"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { name: "Dashboard", href: "/", icon: "📊" },
  { name: "Habits", href: "/habits", icon: "✅" },
  { name: "Focus Mode", href: "/focus", icon: "⏱️" },
  { name: "Analytics", href: "/analytics", icon: "📈" },
  { name: "AI Coach", href: "/coach", icon: "🤖" },
  { name: "Leaderboard", href: "/leaderboard", icon: "🏆" },
  { name: "Reports", href: "/reports", icon: "📄" },
  { name: "Profile", href: "/profile", icon: "👤" },
  { name: "Settings", href: "/settings", icon: "⚙️" },
];

export const MobileNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const closeDrawer = () => setIsOpen(false);

  return (
    <>
      {/* ---- Mobile top bar (hidden on desktop via CSS) ---- */}
      <div className="mobile-nav-header">
        <div className="mobile-nav-logo">
          <div className="mobile-nav-logo-badge">XP</div>
          <span className="mobile-nav-logo-text">LifeXP</span>
        </div>
        <button
          className="mobile-nav-hamburger"
          onClick={() => setIsOpen(true)}
          aria-label="Open navigation menu"
          type="button"
        >
          ☰
        </button>
      </div>

      {/* ---- Backdrop overlay ---- */}
      {isOpen && (
        <div
          className="mobile-nav-overlay"
          onClick={closeDrawer}
          aria-hidden="true"
        />
      )}

      {/* ---- Side drawer ---- */}
      {isOpen && (
        <div className="mobile-nav-drawer" role="dialog" aria-modal="true" aria-label="Navigation menu">
          {/* Drawer header */}
          <div className="mobile-drawer-header">
            <div className="mobile-drawer-logo">
              <div className="mobile-nav-logo-badge">XP</div>
              <span className="mobile-nav-logo-text">LifeXP</span>
            </div>
            <button
              className="mobile-drawer-close"
              onClick={closeDrawer}
              aria-label="Close navigation menu"
              type="button"
            >
              ✕
            </button>
          </div>

          {/* User info */}
          {user && (
            <div style={drawerUserInfoStyle}>
              {user.photoURL ? (
                <img src={user.photoURL} alt="User avatar" style={drawerAvatarStyle} />
              ) : (
                <div style={drawerAvatarFallbackStyle}>
                  {user.displayName ? user.displayName.substring(0, 2).toUpperCase() : "XP"}
                </div>
              )}
              <div style={drawerUserTextStyle}>
                <div style={drawerUserNameStyle}>{user.displayName || "Adventurer"}</div>
                <div style={drawerUserEmailStyle}>{user.email}</div>
              </div>
            </div>
          )}

          {/* Navigation links */}
          <nav className="mobile-drawer-nav" aria-label="Main navigation">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`mobile-drawer-link${isActive ? " active" : ""}`}
                  onClick={closeDrawer}
                >
                  <span className="mobile-drawer-icon" aria-hidden="true">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout button */}
          <div style={drawerFooterStyle}>
            <button
              onClick={() => { logout(); closeDrawer(); }}
              style={drawerLogoutStyle}
              type="button"
            >
              🚪 Log Out
            </button>
          </div>
        </div>
      )}
    </>
  );
};

// --- Inline styles for drawer internals (not affected by desktop CSS) ---

const drawerUserInfoStyle: React.CSSProperties = {
  padding: "14px 20px",
  borderBottom: "1px solid #334155",
  display: "flex",
  alignItems: "center",
  gap: "12px",
  flexShrink: 0,
};

const drawerAvatarStyle: React.CSSProperties = {
  width: "44px",
  height: "44px",
  borderRadius: "50%",
  border: "2px solid #F59E0B",
  flexShrink: 0,
};

const drawerAvatarFallbackStyle: React.CSSProperties = {
  width: "44px",
  height: "44px",
  borderRadius: "50%",
  backgroundColor: "#334155",
  border: "2px solid #F59E0B",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontWeight: "800",
  fontSize: "1rem",
  color: "#F59E0B",
  flexShrink: 0,
};

const drawerUserTextStyle: React.CSSProperties = {
  overflow: "hidden",
};

const drawerUserNameStyle: React.CSSProperties = {
  fontWeight: "700",
  fontSize: "0.95rem",
  color: "#F8FAFC",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const drawerUserEmailStyle: React.CSSProperties = {
  fontSize: "0.8rem",
  color: "#94A3B8",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const drawerFooterStyle: React.CSSProperties = {
  padding: "16px 20px",
  borderTop: "1px solid #334155",
  flexShrink: 0,
};

const drawerLogoutStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px",
  backgroundColor: "#334155",
  border: "1px solid #475569",
  borderRadius: "8px",
  color: "#F8FAFC",
  fontWeight: "600",
  fontSize: "0.95rem",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
};
