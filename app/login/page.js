// app/login/page.js
"use client";
import { useState } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import Link from "next/link";

export default function LoginPage() {
  const { login } = useAuth();
  const [form,  setForm]  = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-paper flex items-center justify-center p-6 overflow-y-auto">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl font-bold text-ink mb-1">Voyagr</h1>
          <p className="font-ui text-sm text-ink">
            Smart Travel Planner
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-sand p-8 shadow-sm">
          <h2 className="font-display text-2xl font-bold text-ink mb-1">Welcome back</h2>
          <p className="font-ui text-sm text-ink mb-7">Sign in to your account to continue</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 font-ui text-sm px-4 py-3 rounded-lg mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="font-ui text-sm font-medium text-ink mb-1.5 block">
                Email
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="input-base w-full"
              />
            </div>

            <div>
              <label className="font-ui text-sm font-medium text-ink mb-1.5 block">
                Password
              </label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="input-base w-full"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-accent w-full justify-center mt-2"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center font-ui text-sm text-ink mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-accent font-semibold hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}