"use client";

import React, { useState } from "react";
import { ProtectedRoute } from "../../components/layout/ProtectedRoute";
import { Sidebar } from "../../components/layout/Sidebar";
import { Header } from "../../components/layout/Header";

export interface Habit {
  id: string;
  title: string;
  category: "Health" | "Productivity" | "Learning" | "Mindfulness";
  frequency: "daily" | "weekly" | "monthly";
  targetQuantity: number;
  unit: string;
  currentStreak: number;
  longestStreak: number;
  // Map date string YYYY-MM-DD -> completion count / status boolean
  logs: Record<string, boolean>;
}

export default function HabitsPage() {
  const [viewMode, setViewMode] = useState<"daily" | "weekly" | "monthly">("weekly");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  // Initial Mock Habits for Excel Tracker
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: "h1",
      title: "Gym & Strength Training",
      category: "Health",
      frequency: "daily",
      targetQuantity: 1,
      unit: "session",
      currentStreak: 12,
      longestStreak: 18,
      logs: {
        "2026-07-20": true,
        "2026-07-21": true,
        "2026-07-22": true,
        "2026-07-23": true,
      },
    },
    {
      id: "h2",
      title: "Read Technical Articles / Books",
      category: "Learning",
      frequency: "daily",
      targetQuantity: 20,
      unit: "pages",
      currentStreak: 5,
      longestStreak: 14,
      logs: {
        "2026-07-20": true,
        "2026-07-21": false,
        "2026-07-22": true,
        "2026-07-23": true,
      },
    },
    {
      id: "h3",
      title: "Deep Work Focus Block (45m)",
      category: "Productivity",
      frequency: "daily",
      targetQuantity: 2,
      unit: "blocks",
      currentStreak: 8,
      longestStreak: 10,
      logs: {
        "2026-07-20": true,
        "2026-07-21": true,
        "2026-07-22": false,
        "2026-07-23": true,
      },
    },
    {
      id: "h4",
      title: "10-min Mindfulness Meditation",
      category: "Mindfulness",
      frequency: "daily",
      targetQuantity: 1,
      unit: "session",
      currentStreak: 14,
      longestStreak: 30,
      logs: {
        "2026-07-20": true,
        "2026-07-21": true,
        "2026-07-22": true,
        "2026-07-23": true,
      },
    },
  ]);

  // Form State
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<Habit["category"]>("Health");
  const [newFrequency, setNewFrequency] = useState<Habit["frequency"]>("daily");
  const [newTarget, setNewTarget] = useState(1);
  const [newUnit, setNewUnit] = useState("times");

  // Dates for current weekly spreadsheet matrix (Mon 20 - Sun 26 Jul 2026)
  const weekDays = [
    { label: "Mon 20", dateStr: "2026-07-20" },
    { label: "Tue 21", dateStr: "2026-07-21" },
    { label: "Wed 22", dateStr: "2026-07-22" },
    { label: "Thu 23", dateStr: "2026-07-23" },
    { label: "Fri 24", dateStr: "2026-07-24" },
    { label: "Sat 25", dateStr: "2026-07-25" },
    { label: "Sun 26", dateStr: "2026-07-26" },
  ];

  const todayStr = "2026-07-23";

  // Toggle log for specific date
  const toggleCell = (habitId: string, dateStr: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === habitId) {
          const current = !!h.logs[dateStr];
          const updatedLogs = { ...h.logs, [dateStr]: !current };
          const updatedStreak = !current ? h.currentStreak + 1 : Math.max(0, h.currentStreak - 1);
          return {
            ...h,
            logs: updatedLogs,
            currentStreak: updatedStreak,
            longestStreak: Math.max(h.longestStreak, updatedStreak),
          };
        }
        return h;
      })
    );
  };

  // Save new or edited habit
  const handleSaveHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    if (editingHabit) {
      setHabits((prev) =>
        prev.map((h) =>
          h.id === editingHabit.id
            ? {
                ...h,
                title: newTitle,
                category: newCategory,
                frequency: newFrequency,
                targetQuantity: newTarget,
                unit: newUnit,
              }
            : h
        )
      );
    } else {
      const created: Habit = {
        id: `h_${Date.now()}`,
        title: newTitle,
        category: newCategory,
        frequency: newFrequency,
        targetQuantity: newTarget,
        unit: newUnit,
        currentStreak: 0,
        longestStreak: 0,
        logs: {},
      };
      setHabits((prev) => [...prev, created]);
    }

    closeModal();
  };

  const openCreateModal = () => {
    setEditingHabit(null);
    setNewTitle("");
    setNewCategory("Health");
    setNewFrequency("daily");
    setNewTarget(1);
    setNewUnit("times");
    setIsModalOpen(true);
  };

  const openEditModal = (habit: Habit) => {
    setEditingHabit(habit);
    setNewTitle(habit.title);
    setNewCategory(habit.category);
    setNewFrequency(habit.frequency);
    setNewTarget(habit.targetQuantity);
    setNewUnit(habit.unit);
    setIsModalOpen(true);
  };

  const deleteHabit = (id: string) => {
    if (confirm("Are you sure you want to delete this habit?")) {
      setHabits((prev) => prev.filter((h) => h.id !== id));
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingHabit(null);
  };

  return (
    <ProtectedRoute>
      <div style={layoutStyle}>
        <Sidebar />

        <div style={mainWrapperStyle}>
          <Header />

          <main style={contentStyle}>
            {/* Top Action Header & View Switcher */}
            <div style={topBarStyle}>
              <div>
                <h1 style={pageTitleStyle}>📊 Excel Habit Tracker</h1>
                <p style={pageSubtitleStyle}>
                  Manage, log, and analyze your habits with spreadsheet precision.
                </p>
              </div>

              <div style={controlsRightStyle}>
                {/* View Switcher Tabs */}
                <div style={tabGroupStyle}>
                  <button
                    onClick={() => setViewMode("daily")}
                    style={{
                      ...tabButtonStyle,
                      backgroundColor: viewMode === "daily" ? "#F59E0B" : "transparent",
                      color: viewMode === "daily" ? "#0F172A" : "#CBD5E1",
                    }}
                  >
                    Daily View
                  </button>
                  <button
                    onClick={() => setViewMode("weekly")}
                    style={{
                      ...tabButtonStyle,
                      backgroundColor: viewMode === "weekly" ? "#F59E0B" : "transparent",
                      color: viewMode === "weekly" ? "#0F172A" : "#CBD5E1",
                    }}
                  >
                    Weekly Matrix
                  </button>
                  <button
                    onClick={() => setViewMode("monthly")}
                    style={{
                      ...tabButtonStyle,
                      backgroundColor: viewMode === "monthly" ? "#F59E0B" : "transparent",
                      color: viewMode === "monthly" ? "#0F172A" : "#CBD5E1",
                    }}
                  >
                    Monthly Grid
                  </button>
                </div>

                <button onClick={openCreateModal} style={addButtonStyle}>
                  + New Habit
                </button>
              </div>
            </div>

            {/* DAILY VIEW */}
            {viewMode === "daily" && (
              <div style={dailyContainerStyle}>
                <h2 style={sectionTitleStyle}>Today's Schedule ({todayStr})</h2>
                <div style={dailyGridStyle}>
                  {habits.map((habit) => {
                    const isDone = !!habit.logs[todayStr];
                    return (
                      <div
                        key={habit.id}
                        onClick={() => toggleCell(habit.id, todayStr)}
                        style={{
                          ...dailyCardStyle,
                          borderColor: isDone ? "#10B981" : "#334155",
                          backgroundColor: isDone ? "#0F172A" : "#1E293B",
                        }}
                      >
                        <div style={dailyCardHeaderStyle}>
                          <span style={categoryBadgeStyle}>{habit.category}</span>
                          <span style={streakBadgeStyle}>🔥 {habit.currentStreak}d</span>
                        </div>
                        <h3 style={dailyHabitTitleStyle}>{habit.title}</h3>
                        <div style={dailyTargetTextStyle}>
                          Target: {habit.targetQuantity} {habit.unit} / {habit.frequency}
                        </div>
                        <button
                          style={{
                            ...checkToggleButtonStyle,
                            backgroundColor: isDone ? "#10B981" : "#334155",
                            color: isDone ? "#0F172A" : "#F8FAFC",
                          }}
                        >
                          {isDone ? "✓ Completed (+50 XP)" : "Mark Complete"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* WEEKLY MATRIX (EXCEL STYLE TRACKER) */}
            {(viewMode === "weekly" || viewMode === "monthly") && (
              <div style={excelContainerStyle}>
                <div style={tableWrapperStyle}>
                  <table style={tableStyle}>
                    <thead>
                      <tr>
                        <th style={{ ...thStyle, width: "240px", textAlign: "left" }}>Habit Name</th>
                        <th style={thStyle}>Category</th>
                        <th style={thStyle}>Target</th>
                        <th style={thStyle}>Streak</th>
                        {weekDays.map((d) => (
                          <th
                            key={d.dateStr}
                            style={{
                              ...thStyle,
                              backgroundColor: d.dateStr === todayStr ? "#334155" : "#1E293B",
                              color: d.dateStr === todayStr ? "#F59E0B" : "#CBD5E1",
                            }}
                          >
                            {d.label}
                          </th>
                        ))}
                        <th style={thStyle}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {habits.map((habit) => {
                        return (
                          <tr key={habit.id} style={trStyle}>
                            <td style={{ ...tdStyle, fontWeight: "700", textAlign: "left" }}>
                              {habit.title}
                            </td>
                            <td style={tdStyle}>
                              <span style={categoryPillStyle}>{habit.category}</span>
                            </td>
                            <td style={tdStyle}>
                              {habit.targetQuantity} {habit.unit}
                            </td>
                            <td style={{ ...tdStyle, color: "#EF4444", fontWeight: "800" }}>
                              🔥 {habit.currentStreak}d
                            </td>
                            {weekDays.map((d) => {
                              const isChecked = !!habit.logs[d.dateStr];
                              return (
                                <td
                                  key={d.dateStr}
                                  onClick={() => toggleCell(habit.id, d.dateStr)}
                                  style={{
                                    ...tdStyle,
                                    cursor: "pointer",
                                    backgroundColor: isChecked ? "#10B98122" : "transparent",
                                  }}
                                >
                                  <div
                                    style={{
                                      ...cellSquareStyle,
                                      backgroundColor: isChecked ? "#10B981" : "#0F172A",
                                      borderColor: isChecked ? "#10B981" : "#475569",
                                    }}
                                  >
                                    {isChecked && "✓"}
                                  </div>
                                </td>
                              );
                            })}
                            <td style={tdStyle}>
                              <div style={actionRowStyle}>
                                <button
                                  onClick={() => openEditModal(habit)}
                                  style={iconButtonStyle}
                                  title="Edit Habit"
                                >
                                  ✏️
                                </button>
                                <button
                                  onClick={() => deleteHabit(habit.id)}
                                  style={{ ...iconButtonStyle, color: "#EF4444" }}
                                  title="Delete Habit"
                                >
                                  🗑️
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    {/* Excel Formula Aggregations Row */}
                    <tfoot>
                      <tr style={tfootRowStyle}>
                        <td colSpan={4} style={{ ...tdStyle, fontWeight: "800", color: "#F59E0B" }}>
                          SUM / Completion Rate
                        </td>
                        {weekDays.map((d) => {
                          const totalCompleted = habits.filter((h) => !!h.logs[d.dateStr]).length;
                          const pct = habits.length > 0 ? Math.round((totalCompleted / habits.length) * 100) : 0;
                          return (
                            <td key={d.dateStr} style={{ ...tdStyle, fontWeight: "800" }}>
                              {pct}%
                            </td>
                          );
                        })}
                        <td style={tdStyle}>-</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}

            {/* CREATE / EDIT MODAL */}
            {isModalOpen && (
              <div style={modalOverlayStyle}>
                <div style={modalContentStyle}>
                  <div style={modalHeaderStyle}>
                    <h2 style={modalTitleStyle}>
                      {editingHabit ? "Edit Habit" : "Create New Habit"}
                    </h2>
                    <button onClick={closeModal} style={closeButtonStyle}>
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleSaveHabit} style={formStyle}>
                    <div style={inputGroupStyle}>
                      <label style={labelStyle}>Habit Title</label>
                      <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="e.g. Read 30 mins"
                        style={inputStyle}
                        required
                      />
                    </div>

                    <div style={formRowStyle}>
                      <div style={inputGroupStyle}>
                        <label style={labelStyle}>Category</label>
                        <select
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value as any)}
                          style={selectStyle}
                        >
                          <option value="Health">Health</option>
                          <option value="Productivity">Productivity</option>
                          <option value="Learning">Learning</option>
                          <option value="Mindfulness">Mindfulness</option>
                        </select>
                      </div>

                      <div style={inputGroupStyle}>
                        <label style={labelStyle}>Frequency</label>
                        <select
                          value={newFrequency}
                          onChange={(e) => setNewFrequency(e.target.value as any)}
                          style={selectStyle}
                        >
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </div>
                    </div>

                    <div style={formRowStyle}>
                      <div style={inputGroupStyle}>
                        <label style={labelStyle}>Target Quantity</label>
                        <input
                          type="number"
                          min="1"
                          value={newTarget}
                          onChange={(e) => setNewTarget(Number(e.target.value))}
                          style={inputStyle}
                          required
                        />
                      </div>

                      <div style={inputGroupStyle}>
                        <label style={labelStyle}>Unit</label>
                        <input
                          type="text"
                          value={newUnit}
                          onChange={(e) => setNewUnit(e.target.value)}
                          placeholder="e.g. pages, mins"
                          style={inputStyle}
                          required
                        />
                      </div>
                    </div>

                    <button type="submit" style={saveButtonStyle}>
                      {editingHabit ? "Save Changes" : "Create Habit"}
                    </button>
                  </form>
                </div>
              </div>
            )}
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

const controlsRightStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
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

const addButtonStyle: React.CSSProperties = {
  padding: "10px 20px",
  backgroundColor: "#F59E0B",
  color: "#0F172A",
  fontWeight: "800",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  boxShadow: "3px 3px 0px #000",
  fontSize: "0.9rem",
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: "1.2rem",
  fontWeight: "800",
  margin: "0 0 16px 0",
};

const dailyContainerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
};

const dailyGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "16px",
};

const dailyCardStyle: React.CSSProperties = {
  backgroundColor: "#1E293B",
  border: "2px solid",
  borderRadius: "10px",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  cursor: "pointer",
  boxShadow: "3px 3px 0px #000",
};

const dailyCardHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const categoryBadgeStyle: React.CSSProperties = {
  padding: "4px 8px",
  backgroundColor: "#334155",
  borderRadius: "4px",
  fontSize: "0.75rem",
  fontWeight: "700",
  color: "#F59E0B",
};

const streakBadgeStyle: React.CSSProperties = {
  fontSize: "0.85rem",
  fontWeight: "800",
  color: "#EF4444",
};

const dailyHabitTitleStyle: React.CSSProperties = {
  fontSize: "1.1rem",
  fontWeight: "800",
  margin: 0,
};

const dailyTargetTextStyle: React.CSSProperties = {
  fontSize: "0.85rem",
  color: "#94A3B8",
};

const checkToggleButtonStyle: React.CSSProperties = {
  padding: "10px 16px",
  border: "none",
  borderRadius: "6px",
  fontWeight: "800",
  fontSize: "0.9rem",
  cursor: "pointer",
  marginTop: "8px",
};

const excelContainerStyle: React.CSSProperties = {
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
  fontFamily: "Inter, monospace",
};

const thStyle: React.CSSProperties = {
  padding: "12px 16px",
  backgroundColor: "#0F172A",
  border: "1px solid #334155",
  fontSize: "0.85rem",
  fontWeight: "800",
  textAlign: "center",
};

const trStyle: React.CSSProperties = {
  borderBottom: "1px solid #334155",
};

const tdStyle: React.CSSProperties = {
  padding: "12px 16px",
  border: "1px solid #334155",
  fontSize: "0.85rem",
  textAlign: "center",
  color: "#F8FAFC",
};

const categoryPillStyle: React.CSSProperties = {
  padding: "2px 6px",
  backgroundColor: "#334155",
  borderRadius: "4px",
  fontSize: "0.75rem",
  color: "#CBD5E1",
};

const cellSquareStyle: React.CSSProperties = {
  width: "24px",
  height: "24px",
  borderRadius: "4px",
  border: "1px solid",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  margin: "0 auto",
  fontWeight: "900",
  fontSize: "0.85rem",
  color: "#0F172A",
};

const actionRowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  gap: "8px",
};

const iconButtonStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  cursor: "pointer",
  fontSize: "1rem",
};

const tfootRowStyle: React.CSSProperties = {
  backgroundColor: "#0F172A",
};

const modalOverlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(15, 23, 42, 0.8)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalContentStyle: React.CSSProperties = {
  backgroundColor: "#1E293B",
  border: "2px solid #334155",
  borderRadius: "12px",
  padding: "32px",
  maxWidth: "480px",
  width: "100%",
  boxShadow: "6px 6px 0px #000",
};

const modalHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "24px",
};

const modalTitleStyle: React.CSSProperties = {
  fontSize: "1.4rem",
  fontWeight: "800",
  margin: 0,
};

const closeButtonStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  color: "#94A3B8",
  fontSize: "1.2rem",
  cursor: "pointer",
};

const formStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
};

const formRowStyle: React.CSSProperties = {
  display: "flex",
  gap: "16px",
};

const inputGroupStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "6px",
  flex: 1,
};

const labelStyle: React.CSSProperties = {
  fontSize: "0.85rem",
  fontWeight: "700",
  color: "#CBD5E1",
};

const inputStyle: React.CSSProperties = {
  padding: "12px 16px",
  backgroundColor: "#0F172A",
  border: "1px solid #475569",
  borderRadius: "6px",
  color: "#F8FAFC",
  fontSize: "0.95rem",
  outline: "none",
};

const selectStyle: React.CSSProperties = {
  padding: "12px 16px",
  backgroundColor: "#0F172A",
  border: "1px solid #475569",
  borderRadius: "6px",
  color: "#F8FAFC",
  fontSize: "0.95rem",
  outline: "none",
};

const saveButtonStyle: React.CSSProperties = {
  padding: "12px 20px",
  backgroundColor: "#F59E0B",
  color: "#0F172A",
  fontWeight: "800",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  boxShadow: "3px 3px 0px #000",
  fontSize: "1rem",
  marginTop: "8px",
};
