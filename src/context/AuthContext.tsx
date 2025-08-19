import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

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
    // Replace with FastAPI call
    // const res = await api.login({ email, password }); setUser(res.user)
    const mockUser: User = {
      id: "demo",
      name: email.split("@")[0] || "User",
      email,
      categories: JSON.parse(localStorage.getItem("pf:lastCategories") || "[]"),
      newsletter: JSON.parse(localStorage.getItem("pf:lastNewsletter") || "false"),
    };
    setUser(mockUser);
    localStorage.setItem("pf:user", JSON.stringify(mockUser));
  };

  const signUp = async (name: string, email: string, password: string, categories: string[], newsletter: boolean) => {
    // Replace with FastAPI call
    // await api.signup({ name, email, password, categories, newsletter })
    localStorage.setItem("pf:lastCategories", JSON.stringify(categories));
    localStorage.setItem("pf:lastNewsletter", JSON.stringify(newsletter));
    const mockUser: User = { id: "demo", name, email, categories, newsletter };
    setUser(mockUser);
    localStorage.setItem("pf:user", JSON.stringify(mockUser));
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem("pf:user");
  };

  const value = useMemo(() => ({ user, signIn, signUp, signOut }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
