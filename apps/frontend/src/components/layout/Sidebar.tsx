"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

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

  return (
    <aside style={sidebarStyle} className="sidebar-desktop">
      <div style={logoContainerStyle}>
        <div style={logoBadgeStyle}>XP</div>
        <span style={logoTextStyle}>LifeXP</span>
      </div>

      <nav style={navStyle}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                ...navItemStyle,
                backgroundColor: isActive ? "#334155" : "transparent",
                borderLeft: isActive ? "4px solid #F59E0B" : "4px solid transparent",
                color: isActive ? "#F59E0B" : "#CBD5E1",
              }}
            >
              <span style={iconStyle}>{item.icon}</span>
              <span style={labelStyle}>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

const sidebarStyle: React.CSSProperties = {
  width: "240px",
  backgroundColor: "#1E293B",
  borderRight: "2px solid #334155",
  display: "flex",
  flexDirection: "column",
  padding: "20px 0",
  flexShrink: 0,
};

const logoContainerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "0 24px 24px 24px",
  borderBottom: "1px solid #334155",
};

const logoBadgeStyle: React.CSSProperties = {
  backgroundColor: "#F59E0B",
  color: "#0F172A",
  fontWeight: "900",
  fontSize: "1.1rem",
  width: "36px",
  height: "36px",
  borderRadius: "8px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  boxShadow: "2px 2px 0px #000",
};

const logoTextStyle: React.CSSProperties = {
  fontSize: "1.4rem",
  fontWeight: "800",
  color: "#F8FAFC",
  letterSpacing: "-0.02em",
};

const navStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  marginTop: "16px",
};

const navItemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "12px 20px",
  textDecoration: "none",
  fontWeight: "600",
  fontSize: "0.95rem",
  transition: "all 0.15s ease",
};

const iconStyle: React.CSSProperties = {
  fontSize: "1.1rem",
};

const labelStyle: React.CSSProperties = {
  fontSize: "0.95rem",
};
