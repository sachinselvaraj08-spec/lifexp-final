import React from "react";
import { AuthProvider } from "../context/AuthContext";
import { GamificationProvider } from "../context/GamificationContext";
import "../styles/globals.css";

export const metadata = {
  title: "LifeXP",
  description: "Gamified productivity, habits tracker, and analytics dashboard.",
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
            {children}
          </GamificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
