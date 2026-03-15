// lib/api.js — Centralised API client

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || "API error");
  }
  return res.json();
}

// ── Trips ────────────────────────────────────────────────
export const tripsApi = {
  getAll:  ()           => request("/trips"),
  getOne:  (id)         => request(`/trips/${id}`),
  create:  (body)       => request("/trips",     { method: "POST", body: JSON.stringify(body) }),
  update:  (id, body)   => request(`/trips/${id}`,{ method: "PUT",  body: JSON.stringify(body) }),
  delete:  (id)         => request(`/trips/${id}`,{ method: "DELETE" }),
};

// ── Expenses ─────────────────────────────────────────────
export const expensesApi = {
  getByTrip:    (tripId)        => request(`/expenses/trip/${tripId}`),
  getSummary:   (tripId)        => request(`/expenses/trip/${tripId}/summary`),
  create:       (body)          => request("/expenses",                  { method: "POST",   body: JSON.stringify(body) }),
  updateBudget: (tripId, budget)=> request(`/expenses/trip/${tripId}/budget`, { method: "PUT", body: JSON.stringify({ budget }) }),
  delete:       (id)            => request(`/expenses/${id}`,            { method: "DELETE" }),
};

// ── Destinations (dynamic search) ────────────────────────
// Uses Next.js API route — no separate Express server needed
export const destinationsApi = {
  search: async (q) => {
    const res = await fetch(`/api/destinations?q=${encodeURIComponent(q)}`);
    if (!res.ok) return [];
    return res.json();
  },
};

// ── Weather ──────────────────────────────────────────────
export const weatherApi = {
  get: (city) => request(`/weather?city=${encodeURIComponent(city)}`),
};