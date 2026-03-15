// lib/api.js — Centralised API client
// credentials: "include" sends the httpOnly JWT cookie with every request

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",   // ← send JWT cookie automatically
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    // If 401 → session expired, redirect to login
    if (res.status === 401 && typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new Error(err.error || "API error");
  }
  return res.json();
}

export const tripsApi = {
  getAll:  ()           => request("/trips"),
  getOne:  (id)         => request(`/trips/${id}`),
  create:  (body)       => request("/trips",      { method: "POST",   body: JSON.stringify(body) }),
  update:  (id, body)   => request(`/trips/${id}`,{ method: "PUT",    body: JSON.stringify(body) }),
  delete:  (id)         => request(`/trips/${id}`,{ method: "DELETE" }),
};

export const expensesApi = {
  getByTrip:    (tripId)         => request(`/expenses/trip/${tripId}`),
  create:       (body)           => request("/expenses",                    { method: "POST",   body: JSON.stringify(body) }),
  updateBudget: (tripId, budget) => request(`/expenses/trip/${tripId}/budget`, { method: "PUT", body: JSON.stringify({ budget }) }),
  delete:       (id)             => request(`/expenses/${id}`,              { method: "DELETE" }),
};

export const destinationsApi = {
  search: async (q) => {
    const res = await fetch(`/api/destinations?q=${encodeURIComponent(q)}`);
    if (!res.ok) return [];
    return res.json();
  },
};

export const weatherApi = {
  get: (city) => request(`/weather?city=${encodeURIComponent(city)}`),
};