// lib/auth.js — Auth API client + React context

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const authApi = {
  register: (name, email, password) =>
    fetch(`${BASE}/auth/register`, {
      method:      "POST",
      headers:     { "Content-Type": "application/json" },
      credentials: "include",   // send/receive cookies
      body:        JSON.stringify({ name, email, password }),
    }).then(async (r) => {
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Registration failed");
      return data;
    }),

  login: (email, password) =>
    fetch(`${BASE}/auth/login`, {
      method:      "POST",
      headers:     { "Content-Type": "application/json" },
      credentials: "include",
      body:        JSON.stringify({ email, password }),
    }).then(async (r) => {
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Login failed");
      return data;
    }),

  logout: () =>
    fetch(`${BASE}/auth/logout`, {
      method:      "POST",
      credentials: "include",
    }),

  me: () =>
    fetch(`${BASE}/auth/me`, {
      credentials: "include",
    }).then(async (r) => {
      if (!r.ok) return null;
      const data = await r.json();
      return data.user || null;
    }),
};