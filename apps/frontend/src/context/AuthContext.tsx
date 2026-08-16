"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider } from "../services/firebase";
import { LoginInput, RegisterInput, UserDTO } from "@lifexp/shared";

interface AuthContextType {
  user: UserDTO | null;
  rawUser: FirebaseUser | null;
  token: string | null;
  loading: boolean;
  getIdToken: (forceRefresh?: boolean) => Promise<string | null>;
  login: (credentials: LoginInput) => Promise<void>;
  register: (credentials: RegisterInput) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserDTO | null>(null);
  const [rawUser, setRawUser] = useState<FirebaseUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // ── Helper to dynamically fetch a fresh, unexpired Firebase ID Token ───────
  const getIdToken = useCallback(async (forceRefresh = false): Promise<string | null> => {
    const currentUser = auth.currentUser;
    if (!currentUser) return null;
    try {
      const freshToken = await currentUser.getIdToken(forceRefresh);
      setToken(freshToken);
      return freshToken;
    } catch (err) {
      console.error("[AuthContext] getIdToken failed:", err);
      return null;
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        setRawUser(firebaseUser);
        try {
          const userToken = await firebaseUser.getIdToken();
          setToken(userToken);
        } catch (err) {
          console.error("[AuthContext] Failed to get initial ID token:", err);
          setToken(null);
        }

        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email || "",
          displayName: firebaseUser.displayName || undefined,
          photoURL: firebaseUser.photoURL || undefined,
        });
      } else {
        setRawUser(null);
        setToken(null);
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async ({ email, password }: LoginInput) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const register = async ({ email, password, displayName }: RegisterInput) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Update display name profile in Firebase Auth
      await updateProfile(userCredential.user, { displayName });
      // Force token refresh to fetch updated profile
      const userToken = await userCredential.user.getIdToken(true);
      setToken(userToken);
      setUser({
        uid: userCredential.user.uid,
        email: userCredential.user.email || "",
        displayName: displayName,
      });
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setRawUser(null);
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        rawUser,
        token,
        loading,
        getIdToken,
        login,
        register,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
