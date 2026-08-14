"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div style={loadingContainerStyle}>
        <div style={spinnerStyle}></div>
        <p style={textStyle}>Loading LifeXP Profile...</p>
      </div>
    );
  }

  if (!user) {
    return null; // Return nothing while redirecting to keep route secure
  }

  return <>{children}</>;
};

// Vanilla inline CSS styles
const loadingContainerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  backgroundColor: "#0F172A",
  color: "#F8FAFC",
  fontFamily: "Inter, system-ui, sans-serif",
};

const spinnerStyle: React.CSSProperties = {
  width: "50px",
  height: "50px",
  border: "5px solid #334155",
  borderTop: "5px solid #F59E0B",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
  marginBottom: "20px",
};

const textStyle: React.CSSProperties = {
  fontSize: "1.1rem",
  fontWeight: "500",
  letterSpacing: "0.05em",
};
