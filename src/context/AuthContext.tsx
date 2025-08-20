import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "@/services/api";

export type User = {
  id: string;
  name: string;
  email: string;
  categories: string[];
  newsletter: boolean;
};

type AuthContextType = {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string, categories: string[], newsletter: boolean) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("pf:user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const res = await api.login({ email, password });
      const userData: User = {
        id: res.user.id,
        name: res.user.name,
        email: res.user.email,
        categories: res.user.categories,
        newsletter: res.user.newsletter,
      };
      setUser(userData);
      localStorage.setItem("pf:user", JSON.stringify(userData));
      localStorage.setItem("pf:token", res.access_token);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const signUp = async (name: string, email: string, password: string, categories: string[], newsletter: boolean) => {
    try {
      const res = await api.signup({ name, email, password, categories, newsletter });
      const userData: User = {
        id: res.user.id,
        name: res.user.name,
        email: res.user.email,
        categories: res.user.categories,
        newsletter: res.user.newsletter,
      };
      setUser(userData);
      localStorage.setItem("pf:user", JSON.stringify(userData));
      localStorage.setItem("pf:token", res.access_token);
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem("pf:user");
    localStorage.removeItem("pf:token");
  };

  const value = useMemo(() => ({ user, signIn, signUp, signOut }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
