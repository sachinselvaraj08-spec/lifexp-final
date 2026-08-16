"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { LoginSchema } from "@lifexp/shared";

export default function LoginPage() {
  const { user, login, loginWithGoogle, loading } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFormLoading(true);

    const validation = LoginSchema.safeParse({ email, password });
    if (!validation.success) {
      setError(validation.error.errors[0].message);
      setFormLoading(false);
      return;
    }

    try {
      await login({ email, password });
      router.push("/");
    } catch (err: any) {
      setError(err?.message || "Failed to log in. Please check your credentials.");
      setFormLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setFormLoading(true);
    try {
      await loginWithGoogle();
      router.push("/");
    } catch (err: any) {
      setError(err?.message || "Failed to authenticate with Google.");
      setFormLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle} className="auth-card">
        <h1 style={titleStyle} className="auth-title">LifeXP</h1>
        <p style={subtitleStyle}>Level up your habits and track your focus.</p>

        {error && <div style={errorStyle}>{error}</div>}

        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. name@domain.com"
              style={inputStyle}
              required
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={inputStyle}
              required
            />
          </div>

          <button
            type="submit"
            disabled={formLoading || loading}
            style={submitButtonStyle}
          >
            {formLoading ? "Signing In..." : "Log In"}
          </button>
        </form>

        <div style={dividerStyle}>
          <span style={dividerTextStyle}>or continue with</span>
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={formLoading || loading}
          style={googleButtonStyle}
        >
          <svg style={googleIconStyle} viewBox="0 0 24 24" width="20" height="20">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Sign in with Google
        </button>

        <p style={footerTextStyle}>
          Don't have an account?{" "}
          <Link href="/register" style={linkStyle}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

// Neobrutalist Gamified styles using vanilla inline styles
const containerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  backgroundColor: "#0F172A",
  padding: "20px",
  fontFamily: "Inter, system-ui, sans-serif",
};

const cardStyle: React.CSSProperties = {
  backgroundColor: "#1E293B",
  border: "2px solid #334155",
  borderRadius: "8px",
  padding: "40px",
  maxWidth: "420px",
  width: "100%",
  boxShadow: "6px 6px 0px 0px #000000",
};

const titleStyle: React.CSSProperties = {
  fontSize: "2.5rem",
  fontWeight: "800",
  textAlign: "center",
  color: "#F8FAFC",
  margin: "0 0 10px 0",
};

const subtitleStyle: React.CSSProperties = {
  color: "#94A3B8",
  textAlign: "center",
  fontSize: "0.95rem",
  margin: "0 0 30px 0",
};

const formStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
};

const inputGroupStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "6px",
};

const labelStyle: React.CSSProperties = {
  fontSize: "0.85rem",
  fontWeight: "600",
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

const submitButtonStyle: React.CSSProperties = {
  padding: "12px 20px",
  backgroundColor: "#F59E0B",
  color: "#0F172A",
  fontWeight: "700",
  fontSize: "1rem",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  boxShadow: "3px 3px 0px 0px #000000",
  transition: "transform 0.1s, box-shadow 0.1s",
};

const dividerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  textAlign: "center",
  margin: "24px 0",
};

const dividerTextStyle: React.CSSProperties = {
  width: "100%",
  fontSize: "0.8rem",
  color: "#64748B",
  fontWeight: "600",
};

const googleButtonStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "10px",
  width: "100%",
  padding: "12px 20px",
  backgroundColor: "#1E293B",
  border: "2px solid #334155",
  borderRadius: "6px",
  color: "#F8FAFC",
  fontWeight: "600",
  fontSize: "0.95rem",
  cursor: "pointer",
  boxShadow: "3px 3px 0px 0px #000000",
};

const googleIconStyle: React.CSSProperties = {
  flexShrink: 0,
};

const errorStyle: React.CSSProperties = {
  padding: "12px",
  backgroundColor: "#EF444422",
  border: "1px solid #EF4444",
  borderRadius: "6px",
  color: "#FCA5A5",
  fontSize: "0.85rem",
  marginBottom: "20px",
  textAlign: "center",
};

const footerTextStyle: React.CSSProperties = {
  textAlign: "center",
  fontSize: "0.85rem",
  color: "#94A3B8",
  marginTop: "24px",
};

const linkStyle: React.CSSProperties = {
  color: "#F59E0B",
  fontWeight: "600",
};
