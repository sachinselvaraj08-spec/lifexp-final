import React from "react";
import { AuthProvider } from "../context/AuthContext";
import { GamificationProvider } from "../context/GamificationContext";
import { HabitsProvider } from "../context/HabitsContext";
import "../styles/globals.css";
import "../styles/mobile.css";

export const metadata = {
  title: "LifeXP",
  description: "Gamified productivity, habits tracker, and analytics dashboard.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <GamificationProvider>
            <HabitsProvider>
              {children}
            </HabitsProvider>
          </GamificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
