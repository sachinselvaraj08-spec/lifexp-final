"use client";

import React, { useState } from "react";
import { ProtectedRoute } from "../../components/layout/ProtectedRoute";
import { Sidebar } from "../../components/layout/Sidebar";
import { Header } from "../../components/layout/Header";
import { MobileNav } from "../../components/layout/MobileNav";

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "year">("30d");

  // Calculated Scores
  const productivityScore = 92;
  const disciplineScore = 88;

  // Mock 52-week activity heatmap data (simplified matrix of 30 days for demonstration)
  const heatmapDays = Array.from({ length: 35 }).map((_, index) => {
    const intensity = (index * 7 + 3) % 5; // 0 to 4
    return {
      day: index + 1,
      intensity, // 0: none, 1: low, 2: med, 3: high, 4: max
    };
  });

  const getHeatmapColor = (intensity: number) => {
    switch (intensity) {
      case 1:
        return "#064E3B"; // Dark Emerald
      case 2:
        return "#047857";
      case 3:
        return "#10B981";
      case 4:
        return "#34D399"; // Bright Emerald
      default:
        return "#1E293B"; // Empty
    }
  };

  const categoryBreakdown = [
    { category: "Health & Fitness", percentage: 35, color: "#10B981" },
    { category: "Deep Work & Productivity", percentage: 40, color: "#F59E0B" },
    { category: "Learning & Reading", percentage: 15, color: "#3B82F6" },
    { category: "Mindfulness", percentage: 10, color: "#EC4899" },
  ];

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
                <h1 style={pageTitleStyle}>📈 Performance & Analytics</h1>
                <p style={pageSubtitleStyle}>
                  Track your growth metrics, consistency heatmaps, and productivity scores.
                </p>
              </div>

              <div style={timeRangeSelectorStyle} className="analytics-time-range">
                <button
                  onClick={() => setTimeRange("7d")}
                  style={{
                    ...rangeButtonStyle,
                    backgroundColor: timeRange === "7d" ? "#F59E0B" : "transparent",
                    color: timeRange === "7d" ? "#0F172A" : "#CBD5E1",
                  }}
                >
                  Last 7 Days
                </button>
                <button
                  onClick={() => setTimeRange("30d")}
                  style={{
                    ...rangeButtonStyle,
                    backgroundColor: timeRange === "30d" ? "#F59E0B" : "transparent",
                    color: timeRange === "30d" ? "#0F172A" : "#CBD5E1",
                  }}
                >
                  Last 30 Days
                </button>
                <button
                  onClick={() => setTimeRange("year")}
                  style={{
                    ...rangeButtonStyle,
                    backgroundColor: timeRange === "year" ? "#F59E0B" : "transparent",
                    color: timeRange === "year" ? "#0F172A" : "#CBD5E1",
                  }}
                >
                  Full Year
                </button>
              </div>
            </div>

            {/* Scores Row */}
            <div style={scoresGridStyle} className="grid-2col">
              <div style={scoreCardStyle}>
                <div style={scoreHeaderStyle}>
                  <span style={scoreTitleStyle}>Productivity Score</span>
                  <span style={gradeBadgeStyle}>A+ Excellent</span>
                </div>
                <div style={scoreValueRowStyle}>
                  <div style={scoreNumberStyle}>{productivityScore}</div>
                  <div style={maxScoreStyle}>/ 100</div>
                </div>
                <div style={barContainerStyle}>
                  <div style={{ ...barFillStyle, width: `${productivityScore}%`, backgroundColor: "#F59E0B" }} />
                </div>
                <p style={scoreDescStyle}>Calculated based on Focus Mode efficiency & daily goal completions.</p>
              </div>

              <div style={scoreCardStyle}>
                <div style={scoreHeaderStyle}>
                  <span style={scoreTitleStyle}>Discipline Score</span>
                  <span style={{ ...gradeBadgeStyle, backgroundColor: "#10B981", color: "#0F172A" }}>
                    A Master
                  </span>
                </div>
                <div style={scoreValueRowStyle}>
                  <div style={{ ...scoreNumberStyle, color: "#10B981" }}>{disciplineScore}</div>
                  <div style={maxScoreStyle}>/ 100</div>
                </div>
                <div style={barContainerStyle}>
                  <div style={{ ...barFillStyle, width: `${disciplineScore}%`, backgroundColor: "#10B981" }} />
                </div>
                <p style={scoreDescStyle}>Based on habit streak retention rate and recovery token usage.</p>
              </div>
            </div>

            {/* Consistency Heatmap */}
            <div style={cardStyle}>
              <div style={cardHeaderStyle}>
                <h2 style={cardTitleStyle}>🟩 Habit Consistency Heatmap</h2>
                <div style={heatmapLegendStyle}>
                  <span style={legendTextStyle}>Less</span>
                  <div style={{ ...legendSquareStyle, backgroundColor: "#1E293B" }} />
                  <div style={{ ...legendSquareStyle, backgroundColor: "#064E3B" }} />
                  <div style={{ ...legendSquareStyle, backgroundColor: "#047857" }} />
                  <div style={{ ...legendSquareStyle, backgroundColor: "#10B981" }} />
                  <div style={{ ...legendSquareStyle, backgroundColor: "#34D399" }} />
                  <span style={legendTextStyle}>More</span>
                </div>
              </div>

              <div style={heatmapGridStyle} className="heatmap-grid">
                {heatmapDays.map((d) => (
                  <div
                    key={d.day}
                    style={{
                      ...heatmapSquareStyle,
                      backgroundColor: getHeatmapColor(d.intensity),
                    }}
                    className="heatmap-cell"
                    title={`Day ${d.day}: ${d.intensity * 2} habits completed`}
                  />
                ))}
              </div>
            </div>

            {/* Category Breakdown & Trend Charts */}
            <div style={gridTwoColStyle} className="grid-2col">
              <div style={cardStyle}>
                <h2 style={cardTitleStyle}>🎯 Category Distribution</h2>
                <div style={categoryListStyle}>
                  {categoryBreakdown.map((item) => (
                    <div key={item.category} style={categoryItemStyle}>
                      <div style={categoryMetaRowStyle}>
                        <span style={categoryNameStyle}>{item.category}</span>
                        <span style={categoryPctStyle}>{item.percentage}%</span>
                      </div>
                      <div style={barContainerStyle}>
                        <div
                          style={{
                            ...barFillStyle,
                            width: `${item.percentage}%`,
                            backgroundColor: item.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={cardStyle}>
                <h2 style={cardTitleStyle}>⏱️ Weekly Focus Trends</h2>
                <div style={chartPlaceholderStyle}>
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, idx) => {
                    const height = [40, 65, 80, 95, 50, 75, 90][idx];
                    return (
                      <div key={day} style={chartColumnStyle}>
                        <div style={{ ...chartBarFillStyle, height: `${height}%` }} />
                        <span style={chartDayLabelStyle}>{day}</span>
                      </div>
                    );
                  })}
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

const timeRangeSelectorStyle: React.CSSProperties = {
  display: "flex",
  backgroundColor: "#1E293B",
  borderRadius: "8px",
  padding: "4px",
  border: "1px solid #334155",
};

const rangeButtonStyle: React.CSSProperties = {
  padding: "8px 16px",
  border: "none",
  borderRadius: "6px",
  fontWeight: "700",
  fontSize: "0.85rem",
  cursor: "pointer",
  transition: "all 0.15s ease",
};

const scoresGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "24px",
};

const scoreCardStyle: React.CSSProperties = {
  backgroundColor: "#1E293B",
  border: "2px solid #334155",
  borderRadius: "12px",
  padding: "24px",
  boxShadow: "4px 4px 0px #000",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const scoreHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const scoreTitleStyle: React.CSSProperties = {
  fontSize: "1.1rem",
  fontWeight: "800",
  color: "#F8FAFC",
};

const gradeBadgeStyle: React.CSSProperties = {
  padding: "4px 10px",
  backgroundColor: "#F59E0B",
  color: "#0F172A",
  fontWeight: "900",
  fontSize: "0.8rem",
  borderRadius: "6px",
  boxShadow: "2px 2px 0px #000",
};

const scoreValueRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "baseline",
  gap: "6px",
};

const scoreNumberStyle: React.CSSProperties = {
  fontSize: "3rem",
  fontWeight: "900",
  color: "#F59E0B",
};

const maxScoreStyle: React.CSSProperties = {
  fontSize: "1.2rem",
  color: "#94A3B8",
  fontWeight: "700",
};

const barContainerStyle: React.CSSProperties = {
  width: "100%",
  height: "10px",
  backgroundColor: "#0F172A",
  borderRadius: "6px",
  overflow: "hidden",
};

const barFillStyle: React.CSSProperties = {
  height: "100%",
  borderRadius: "6px",
  transition: "width 0.4s ease",
};

const scoreDescStyle: React.CSSProperties = {
  fontSize: "0.85rem",
  color: "#94A3B8",
  margin: 0,
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

const heatmapLegendStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
};

const legendTextStyle: React.CSSProperties = {
  fontSize: "0.75rem",
  color: "#94A3B8",
};

const legendSquareStyle: React.CSSProperties = {
  width: "12px",
  height: "12px",
  borderRadius: "2px",
};

const heatmapGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(7, 1fr)",
  gap: "8px",
};

const heatmapSquareStyle: React.CSSProperties = {
  height: "36px",
  borderRadius: "6px",
  border: "1px solid #334155",
  cursor: "pointer",
  transition: "transform 0.15s ease",
};

const gridTwoColStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "24px",
};

const categoryListStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
};

const categoryItemStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "6px",
};

const categoryMetaRowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  fontSize: "0.9rem",
};

const categoryNameStyle: React.CSSProperties = {
  fontWeight: "700",
};

const categoryPctStyle: React.CSSProperties = {
  fontWeight: "800",
  color: "#F59E0B",
};

const chartPlaceholderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-around",
  alignItems: "flex-end",
  height: "180px",
  paddingTop: "20px",
  borderBottom: "2px solid #334155",
};

const chartColumnStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "8px",
  height: "100%",
  justifyContent: "flex-end",
  width: "30px",
};

const chartBarFillStyle: React.CSSProperties = {
  width: "100%",
  backgroundColor: "#F59E0B",
  borderRadius: "4px 4px 0 0",
  transition: "height 0.4s ease",
};

const chartDayLabelStyle: React.CSSProperties = {
  fontSize: "0.75rem",
  fontWeight: "700",
  color: "#94A3B8",
};
