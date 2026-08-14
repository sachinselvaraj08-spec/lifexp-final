"use client";

import React, { useState } from "react";
import { ProtectedRoute } from "../../components/layout/ProtectedRoute";
import { Sidebar } from "../../components/layout/Sidebar";
import { Header } from "../../components/layout/Header";

export default function ReportsPage() {
  const [isGenerating, setIsGenerating] = useState(false);

  const pastReports = [
    { month: "June 2026", generatedAt: "Jul 01, 2026", size: "1.4 MB", url: "#" },
    { month: "May 2026", generatedAt: "Jun 01, 2026", size: "1.2 MB", url: "#" },
  ];

  const handleGeneratePdf = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      alert("📄 Monthly PDF Report generated successfully! Your report has been prepared.");
    }, 1200);
  };

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
                <h1 style={pageTitleStyle}>📄 Monthly PDF Reports</h1>
                <p style={pageSubtitleStyle}>
                  Generate executive-level summary reports of your productivity and habits.
                </p>
              </div>

              <button
                onClick={handleGeneratePdf}
                disabled={isGenerating}
                style={generateButtonStyle}
              >
                {isGenerating ? "Generating PDF..." : "📥 Generate July 2026 Report"}
              </button>
            </div>

            {/* Live Report Preview Document */}
            <div style={documentCardStyle}>
              <div style={docHeaderStyle}>
                <div>
                  <h2 style={docTitleStyle}>LifeXP Monthly Performance Summary</h2>
                  <div style={docSubtitleStyle}>Report Period: July 1 - July 23, 2026 • User: Adventurer</div>
                </div>
                <div style={docBadgeStyle}>PDF PREVIEW</div>
              </div>

              <div style={dividerStyle} />

              <div style={gridMetricsStyle}>
                <div style={metricBoxStyle}>
                  <div style={metricLabelStyle}>Total Habits Completed</div>
                  <div style={metricValueStyle}>142</div>
                </div>
                <div style={metricBoxStyle}>
                  <div style={metricLabelStyle}>Total Focus Time</div>
                  <div style={metricValueStyle}>32.5 Hours</div>
                </div>
                <div style={metricBoxStyle}>
                  <div style={metricLabelStyle}>Productivity Score</div>
                  <div style={{ ...metricValueStyle, color: "#F59E0B" }}>92 / 100</div>
                </div>
                <div style={metricBoxStyle}>
                  <div style={metricLabelStyle}>Discipline Score</div>
                  <div style={{ ...metricValueStyle, color: "#10B981" }}>88 / 100</div>
                </div>
              </div>

              <div style={sectionBoxStyle}>
                <h3 style={sectionTitleStyle}>🤖 AI Coach Executive Assessment</h3>
                <p style={sectionTextStyle}>
                  "The user demonstrated exceptional consistency in Morning Workouts (12-day streak) and Deep Work Sessions (32.5 hours total). Main area of growth: Maintain consistency on weekends."
                </p>
              </div>
            </div>

            {/* Archives Section */}
            <div style={cardStyle}>
              <h2 style={cardTitleStyle}>📁 Past Monthly Archives</h2>
              <div style={archiveListStyle}>
                {pastReports.map((report, i) => (
                  <div key={i} style={archiveItemStyle}>
                    <div>
                      <div style={archiveMonthStyle}>{report.month} Report</div>
                      <div style={archiveMetaStyle}>Generated on {report.generatedAt} • {report.size}</div>
                    </div>
                    <button onClick={handleGeneratePdf} style={downloadButtonStyle}>
                      ⬇️ Download PDF
                    </button>
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

const generateButtonStyle: React.CSSProperties = {
  padding: "12px 24px",
  backgroundColor: "#F59E0B",
  color: "#0F172A",
  fontWeight: "800",
  fontSize: "0.95rem",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  boxShadow: "3px 3px 0px #000",
};

const documentCardStyle: React.CSSProperties = {
  backgroundColor: "#1E293B",
  border: "2px solid #334155",
  borderRadius: "12px",
  padding: "32px",
  boxShadow: "4px 4px 0px #000",
  display: "flex",
  flexDirection: "column",
  gap: "24px",
};

const docHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
};

const docTitleStyle: React.CSSProperties = {
  fontSize: "1.5rem",
  fontWeight: "800",
  margin: "0 0 6px 0",
};

const docSubtitleStyle: React.CSSProperties = {
  color: "#94A3B8",
  fontSize: "0.9rem",
};

const docBadgeStyle: React.CSSProperties = {
  padding: "4px 10px",
  backgroundColor: "#0F172A",
  border: "1px solid #334155",
  borderRadius: "6px",
  fontSize: "0.75rem",
  fontWeight: "800",
  color: "#F59E0B",
};

const dividerStyle: React.CSSProperties = {
  height: "1px",
  backgroundColor: "#334155",
};

const gridMetricsStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "16px",
};

const metricBoxStyle: React.CSSProperties = {
  backgroundColor: "#0F172A",
  border: "1px solid #334155",
  borderRadius: "8px",
  padding: "16px",
};

const metricLabelStyle: React.CSSProperties = {
  fontSize: "0.8rem",
  color: "#94A3B8",
  marginBottom: "4px",
};

const metricValueStyle: React.CSSProperties = {
  fontSize: "1.4rem",
  fontWeight: "900",
};

const sectionBoxStyle: React.CSSProperties = {
  backgroundColor: "#0F172A",
  borderLeft: "4px solid #F59E0B",
  padding: "20px",
  borderRadius: "8px",
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: "1rem",
  fontWeight: "800",
  color: "#F59E0B",
  margin: "0 0 8px 0",
};

const sectionTextStyle: React.CSSProperties = {
  fontSize: "0.9rem",
  color: "#CBD5E1",
  margin: 0,
  lineHeight: "1.5",
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

const archiveListStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const archiveItemStyle: React.CSSProperties = {
  backgroundColor: "#0F172A",
  border: "1px solid #334155",
  borderRadius: "8px",
  padding: "16px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const archiveMonthStyle: React.CSSProperties = {
  fontWeight: "800",
  fontSize: "0.95rem",
};

const archiveMetaStyle: React.CSSProperties = {
  fontSize: "0.8rem",
  color: "#94A3B8",
  marginTop: "2px",
};

const downloadButtonStyle: React.CSSProperties = {
  padding: "8px 16px",
  backgroundColor: "#334155",
  color: "#F8FAFC",
  border: "none",
  borderRadius: "6px",
  fontWeight: "700",
  fontSize: "0.85rem",
  cursor: "pointer",
};
