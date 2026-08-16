"use client";

import React, { useState } from "react";
import { ProtectedRoute } from "../../components/layout/ProtectedRoute";
import { Sidebar } from "../../components/layout/Sidebar";
import { Header } from "../../components/layout/Header";
import { MobileNav } from "../../components/layout/MobileNav";

export default function SettingsPage() {
  // Android Screen Time State
  const [androidSyncEnabled, setAndroidSyncEnabled] = useState(true);
  const [blockedApps, setBlockedApps] = useState(["com.instagram.android", "com.google.android.youtube"]);

  // Notifications State
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailDigest, setEmailDigest] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);

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
                <h1 style={pageTitleStyle}>⚙️ System Settings & Integrations</h1>
                <p style={pageSubtitleStyle}>
                  Configure Android Screen Time, push notifications, and export account data.
                </p>
              </div>
            </div>

            {/* Android Screen Time Integration Card */}
            <div style={cardStyle}>
              <div style={cardHeaderStyle} className="settings-card-header">
                <h2 style={cardTitleStyle}>📱 Android Screen Time Integration</h2>
                <span style={activeBadgeStyle}>
                  {androidSyncEnabled ? "Connected (UsageStats API)" : "Disconnected"}
                </span>
              </div>

              <div style={settingRowStyle}>
                <div>
                  <div style={settingLabelStyle}>Sync Daily App Usage</div>
                  <div style={settingSubtextStyle}>Automatically track screen time to feed Focus Mode & AI Coach.</div>
                </div>
                <input
                  type="checkbox"
                  checked={androidSyncEnabled}
                  onChange={() => setAndroidSyncEnabled(!androidSyncEnabled)}
                  style={checkboxStyle}
                />
              </div>

              <div style={dividerStyle} />

              <div style={settingGroupStyle}>
                <div style={settingLabelStyle}>Blocked Apps During Focus Mode</div>
                <div style={chipContainerStyle}>
                  {blockedApps.map((app) => (
                    <span key={app} style={chipStyle}>
                      🚫 {app}
                    </span>
                  ))}
                  <button style={addChipButtonStyle}>+ Add App Bundle</button>
                </div>
              </div>
            </div>

            {/* Notifications Settings Card */}
            <div style={cardStyle}>
              <h2 style={cardTitleStyle}>🔔 Notifications & Alert Preferences</h2>

              <div style={settingRowStyle}>
                <div>
                  <div style={settingLabelStyle}>Push Notifications (FCM)</div>
                  <div style={settingSubtextStyle}>Receive streak warnings and level-up alerts.</div>
                </div>
                <input
                  type="checkbox"
                  checked={pushNotifications}
                  onChange={() => setPushNotifications(!pushNotifications)}
                  style={checkboxStyle}
                />
              </div>

              <div style={settingRowStyle}>
                <div>
                  <div style={settingLabelStyle}>Weekly Email Digest</div>
                  <div style={settingSubtextStyle}>Receive your AI Coach weekly summary every Sunday.</div>
                </div>
                <input
                  type="checkbox"
                  checked={emailDigest}
                  onChange={() => setEmailDigest(!emailDigest)}
                  style={checkboxStyle}
                />
              </div>

              <div style={settingRowStyle}>
                <div>
                  <div style={settingLabelStyle}>Game Sound Effects</div>
                  <div style={settingSubtextStyle}>Play chime sounds on habit completion and level ups.</div>
                </div>
                <input
                  type="checkbox"
                  checked={soundEffects}
                  onChange={() => setSoundEffects(!soundEffects)}
                  style={checkboxStyle}
                />
              </div>
            </div>

            {/* Production Deployment & Data Export Card */}
            <div style={cardStyle}>
              <h2 style={cardTitleStyle}>🛡️ Data Privacy & Export</h2>

              <div style={settingRowStyle}>
                <div>
                  <div style={settingLabelStyle}>Export All Habits & Logs (CSV)</div>
                  <div style={settingSubtextStyle}>Download your entire history in open CSV format.</div>
                </div>
                <button style={actionButtonStyle}>Export CSV</button>
              </div>

              <div style={settingRowStyle}>
                <div>
                  <div style={settingLabelStyle}>Export Full Backup (JSON)</div>
                  <div style={settingSubtextStyle}>Includes achievements, XP logs, and focus statistics.</div>
                </div>
                <button style={actionButtonStyle}>Export JSON</button>
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

const activeBadgeStyle: React.CSSProperties = {
  padding: "4px 10px",
  backgroundColor: "#10B98122",
  border: "1px solid #10B981",
  borderRadius: "6px",
  fontSize: "0.8rem",
  fontWeight: "700",
  color: "#10B981",
};

const settingRowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px 0",
};

const settingLabelStyle: React.CSSProperties = {
  fontWeight: "700",
  fontSize: "0.95rem",
};

const settingSubtextStyle: React.CSSProperties = {
  fontSize: "0.85rem",
  color: "#94A3B8",
  marginTop: "2px",
};

const checkboxStyle: React.CSSProperties = {
  width: "20px",
  height: "20px",
  accentColor: "#F59E0B",
  cursor: "pointer",
};

const dividerStyle: React.CSSProperties = {
  height: "1px",
  backgroundColor: "#334155",
};

const settingGroupStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const chipContainerStyle: React.CSSProperties = {
  display: "flex",
  gap: "10px",
  alignItems: "center",
  flexWrap: "wrap",
};

const chipStyle: React.CSSProperties = {
  padding: "6px 12px",
  backgroundColor: "#0F172A",
  border: "1px solid #334155",
  borderRadius: "16px",
  fontSize: "0.85rem",
  fontWeight: "600",
  color: "#CBD5E1",
};

const addChipButtonStyle: React.CSSProperties = {
  padding: "6px 12px",
  backgroundColor: "#334155",
  color: "#F59E0B",
  border: "none",
  borderRadius: "16px",
  fontWeight: "700",
  fontSize: "0.8rem",
  cursor: "pointer",
};

const actionButtonStyle: React.CSSProperties = {
  padding: "8px 16px",
  backgroundColor: "#334155",
  color: "#F8FAFC",
  border: "1px solid #475569",
  borderRadius: "6px",
  fontWeight: "700",
  fontSize: "0.85rem",
  cursor: "pointer",
};
