// components/auth/AuthContext.jsx
// Provides user state + login/logout to entire app
"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authApi } from "@/lib/auth";

const AuthContext = createContext(null);

// Pages that don't need auth
const PUBLIC_ROUTES = ["/login", "/register"];

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);
  const router   = useRouter();
  const pathname = usePathname();

  // Check session on mount
  useEffect(() => {
    authApi.me()
      .then((u) => {
        setUser(u);
        // If not logged in and on protected page → redirect to login
        if (!u && !PUBLIC_ROUTES.includes(pathname)) {
          router.replace("/login");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const { user: u } = await authApi.login(email, password);
    setUser(u);
    router.push("/");
  }

  async function register(name, email, password) {
    const { user: u } = await authApi.register(name, email, password);
    setUser(u);
    router.push("/");
  }

  async function logout() {
    await authApi.logout();
    setUser(null);
    router.push("/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-sand border-t-accent" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}