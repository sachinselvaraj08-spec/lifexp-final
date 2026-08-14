"use client";

import React, { useState } from "react";
import { ProtectedRoute } from "../../components/layout/ProtectedRoute";
import { Sidebar } from "../../components/layout/Sidebar";
import { Header } from "../../components/layout/Header";

interface ChatMessage {
  id: string;
  sender: "user" | "coach";
  text: string;
  timestamp: string;
}

export default function CoachPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m1",
      sender: "coach",
      text: "Hello! I am your LifeXP AI Coach. I've analyzed your recent 12-day streak and focus sessions. How can I help optimize your performance today?",
      timestamp: "10:00 AM",
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const recommendedHabits = [
    { title: "Digital Sunset (No Screens 10 PM)", reason: "Boosts sleep quality & morning focus", category: "Mindfulness" },
    { title: "Cold Shower & Hydration", reason: "Increases alertness & dopamine baseline", category: "Health" },
    { title: "10-min Daily Journaling", reason: "Reflects on wins & clarifies priorities", category: "Productivity" },
  ];

  const handleSendMessage = (textToSend?: string) => {
    const prompt = textToSend || inputPrompt;
    if (!prompt.trim()) return;

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      sender: "user",
      text: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputPrompt("");
    setIsGenerating(true);

    setTimeout(() => {
      let aiResponseText = "Great question! Based on your current habits and 92/100 Productivity Score, I recommend scheduling your hardest deep work block right after your morning routine when willpower is highest.";

      if (prompt.toLowerCase().includes("weekly review")) {
        aiResponseText = "📊 **Weekly Review Summary**: You completed 28 habit entries (88% consistency) and logged 6.5 hours of focus time! Tip for next week: Protect your 2 PM to 4 PM slot from distraction.";
      } else if (prompt.toLowerCase().includes("recommend")) {
        aiResponseText = "💡 **Habit Recommendation**: Try adding a 'Digital Sunset' at 10 PM. Shutting down screens 1 hour before sleep improves morning focus by up to 25%.";
      }

      const coachMsg: ChatMessage = {
        id: `c_${Date.now()}`,
        sender: "coach",
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, coachMsg]);
      setIsGenerating(false);
    }, 1000);
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
                <h1 style={pageTitleStyle}>🤖 AI Productivity Coach</h1>
                <p style={pageSubtitleStyle}>
                  Get personalized recommendations, weekly reviews, and instant coaching.
                </p>
              </div>
            </div>

            {/* Split Screen Layout */}
            <div style={gridTwoColStyle}>
              {/* Left Column: Conversational AI Chat */}
              <div style={chatCardStyle}>
                <div style={chatHeaderStyle}>
                  <div style={coachStatusStyle}>
                    <span style={coachAvatarStyle}>🤖</span>
                    <div>
                      <div style={coachNameStyle}>LifeXP AI Coach</div>
                      <div style={statusTextStyle}>Online • Analyzing your metrics</div>
                    </div>
                  </div>
                </div>

                <div style={messageListStyle}>
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      style={{
                        ...messageBubbleStyle,
                        alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                        backgroundColor: msg.sender === "user" ? "#F59E0B" : "#0F172A",
                        color: msg.sender === "user" ? "#0F172A" : "#F8FAFC",
                        borderColor: msg.sender === "user" ? "#F59E0B" : "#334155",
                      }}
                    >
                      <div style={messageTextStyle}>{msg.text}</div>
                      <div style={messageTimeStyle}>{msg.timestamp}</div>
                    </div>
                  ))}
                  {isGenerating && (
                    <div style={{ ...messageBubbleStyle, alignSelf: "flex-start", backgroundColor: "#0F172A" }}>
                      AI Coach is analyzing...
                    </div>
                  )}
                </div>

                {/* Quick Suggestion Prompts */}
                <div style={quickPromptsRowStyle}>
                  <button
                    onClick={() => handleSendMessage("Generate my Weekly Review")}
                    style={promptChipStyle}
                  >
                    📊 Weekly Review
                  </button>
                  <button
                    onClick={() => handleSendMessage("Recommend a habit to boost energy")}
                    style={promptChipStyle}
                  >
                    💡 Recommend Habit
                  </button>
                  <button
                    onClick={() => handleSendMessage("How do I fix a broken streak?")}
                    style={promptChipStyle}
                  >
                    🔥 Fix Streak
                  </button>
                </div>

                {/* Input Bar */}
                <div style={inputContainerStyle}>
                  <input
                    type="text"
                    value={inputPrompt}
                    onChange={(e) => setInputPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Ask your AI coach anything..."
                    style={inputStyle}
                  />
                  <button onClick={() => handleSendMessage()} style={sendButtonStyle}>
                    Send
                  </button>
                </div>
              </div>

              {/* Right Column: AI Recommendations & Weekly Review Preview */}
              <div style={rightColumnStyle}>
                <div style={cardStyle}>
                  <h2 style={cardTitleStyle}>💡 AI Habit Recommendations</h2>
                  <div style={recListStyle}>
                    {recommendedHabits.map((h, i) => (
                      <div key={i} style={recCardStyle}>
                        <div style={recHeaderStyle}>
                          <span style={recTitleStyle}>{h.title}</span>
                          <span style={categoryBadgeStyle}>{h.category}</span>
                        </div>
                        <p style={recReasonStyle}>{h.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={cardStyle}>
                  <h2 style={cardTitleStyle}>📅 Automated Reviews</h2>
                  <div style={reviewBoxStyle}>
                    <h3 style={reviewTitleStyle}>Weekly Review (Jul 17 - Jul 23)</h3>
                    <p style={reviewBodyStyle}>
                      "You've maintained an 88% discipline rate and logged 3.5 hours of focus mode. Great momentum!"
                    </p>
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

const gridTwoColStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1.2fr 0.8fr",
  gap: "24px",
};

const chatCardStyle: React.CSSProperties = {
  backgroundColor: "#1E293B",
  border: "2px solid #334155",
  borderRadius: "12px",
  padding: "20px",
  boxShadow: "4px 4px 0px #000",
  display: "flex",
  flexDirection: "column",
  height: "600px",
};

const chatHeaderStyle: React.CSSProperties = {
  paddingBottom: "16px",
  borderBottom: "1px solid #334155",
};

const coachStatusStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const coachAvatarStyle: React.CSSProperties = {
  fontSize: "2rem",
};

const coachNameStyle: React.CSSProperties = {
  fontWeight: "800",
  fontSize: "1.1rem",
};

const statusTextStyle: React.CSSProperties = {
  fontSize: "0.8rem",
  color: "#10B981",
  fontWeight: "600",
};

const messageListStyle: React.CSSProperties = {
  flex: 1,
  overflowY: "auto",
  padding: "16px 0",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const messageBubbleStyle: React.CSSProperties = {
  maxWidth: "80%",
  padding: "12px 16px",
  borderRadius: "10px",
  border: "1px solid",
  fontSize: "0.95rem",
  lineHeight: "1.4",
};

const messageTextStyle: React.CSSProperties = {
  margin: 0,
};

const messageTimeStyle: React.CSSProperties = {
  fontSize: "0.7rem",
  opacity: 0.7,
  marginTop: "4px",
  textAlign: "right",
};

const quickPromptsRowStyle: React.CSSProperties = {
  display: "flex",
  gap: "8px",
  marginBottom: "12px",
  overflowX: "auto",
};

const promptChipStyle: React.CSSProperties = {
  padding: "6px 12px",
  backgroundColor: "#0F172A",
  border: "1px solid #334155",
  borderRadius: "16px",
  color: "#F59E0B",
  fontWeight: "700",
  fontSize: "0.8rem",
  cursor: "pointer",
  whiteSpace: "nowrap",
};

const inputContainerStyle: React.CSSProperties = {
  display: "flex",
  gap: "10px",
};

const inputStyle: React.CSSProperties = {
  flex: 1,
  padding: "12px 16px",
  backgroundColor: "#0F172A",
  border: "1px solid #475569",
  borderRadius: "8px",
  color: "#F8FAFC",
  fontSize: "0.95rem",
  outline: "none",
};

const sendButtonStyle: React.CSSProperties = {
  padding: "12px 20px",
  backgroundColor: "#F59E0B",
  color: "#0F172A",
  fontWeight: "800",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

const rightColumnStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "24px",
};

const cardStyle: React.CSSProperties = {
  backgroundColor: "#1E293B",
  border: "2px solid #334155",
  borderRadius: "12px",
  padding: "20px",
  boxShadow: "4px 4px 0px #000",
  display: "flex",
  flexDirection: "column",
  gap: "14px",
};

const cardTitleStyle: React.CSSProperties = {
  fontSize: "1.2rem",
  fontWeight: "800",
  margin: 0,
};

const recListStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const recCardStyle: React.CSSProperties = {
  backgroundColor: "#0F172A",
  border: "1px solid #334155",
  borderRadius: "8px",
  padding: "14px",
};

const recHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "6px",
};

const recTitleStyle: React.CSSProperties = {
  fontWeight: "800",
  fontSize: "0.9rem",
};

const categoryBadgeStyle: React.CSSProperties = {
  padding: "2px 6px",
  backgroundColor: "#334155",
  borderRadius: "4px",
  fontSize: "0.7rem",
  color: "#F59E0B",
  fontWeight: "700",
};

const recReasonStyle: React.CSSProperties = {
  fontSize: "0.8rem",
  color: "#94A3B8",
  margin: 0,
};

const reviewBoxStyle: React.CSSProperties = {
  backgroundColor: "#0F172A",
  padding: "16px",
  borderRadius: "8px",
  borderLeft: "4px solid #10B981",
};

const reviewTitleStyle: React.CSSProperties = {
  fontSize: "0.95rem",
  fontWeight: "800",
  color: "#10B981",
  margin: "0 0 6px 0",
};

const reviewBodyStyle: React.CSSProperties = {
  fontSize: "0.85rem",
  color: "#CBD5E1",
  margin: 0,
  lineHeight: "1.4",
};
