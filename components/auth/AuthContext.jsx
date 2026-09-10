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
  const [user,       setUser]       = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [slow,       setSlow]       = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const router   = useRouter();
  const pathname = usePathname();

  // Check session on mount
  useEffect(() => {
    // If the backend is cold-starting (free-tier hosts sleep when idle),
    // this can take a while — let the user know instead of showing a
    // blank spinner that looks frozen.
    const slowTimer = setTimeout(() => setSlow(true), 4000);

    authApi.me()
      .then((u) => {
        setUser(u);
        // If not logged in and on protected page → redirect to login
        if (!u && !PUBLIC_ROUTES.includes(pathname)) {
          router.replace("/login");
        }
      })
      .finally(() => {
        clearTimeout(slowTimer);
        setLoading(false);
      });

    return () => clearTimeout(slowTimer);
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
    setLoggingOut(true);
    // Clear local state and navigate right away — the JWT cookie is
    // httpOnly (unreadable by JS either way), so there's nothing the UI
    // gains by waiting on the network call. Fire it in the background;
    // if the backend is cold-starting, the user isn't stuck staring at
    // a frozen button for it.
    setUser(null);
    router.push("/login");
    try {
      await authApi.logout();
    } catch {
      // Cookie clearing failed silently server-side is still possible;
      // client-side state is already cleared, which is what matters for UX.
    } finally {
      setLoggingOut(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-paper">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-sand border-t-accent" />
        {slow && (
          <p className="text-sm text-slate-500 max-w-xs text-center">
            Waking up the server — this can take up to a minute on the first visit.
          </p>
        )}
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, loggingOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}