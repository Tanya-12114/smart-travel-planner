"use client";
// app/budget/page.js
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "@/components/ui/PageHeader";
import { tripsApi, expensesApi } from "@/lib/api";
import { CATEGORY_EMOJIS } from "@/lib/destinations";

const CATEGORIES = ["flights","hotels","food","activities","transport","misc"];

function fmt(n) {
  return "₹" + Number(n).toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

export default function BudgetPage() {
  const [trips, setTrips]         = useState([]);
  const [activeTrip, setActive]   = useState(null);
  const [expenses, setExpenses]   = useState([]);
  const [budget, setBudget]       = useState(0);
  const [budgetInput, setBudgetInput] = useState("");
  const [form, setForm]           = useState({ label: "", amount: "", category: "misc" });
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    tripsApi.getAll().then((data) => {
      setTrips(data);
      if (data.length) setActive(data[0]);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!activeTrip) return;
    expensesApi.getByTrip(activeTrip._id).then((data) => {
      setExpenses(data);
      const b = data[0]?.budget || 0;
      setBudget(b);
      setBudgetInput(b || "");
    }).catch(() => setExpenses([]));
  }, [activeTrip]);

  const spent     = expenses.reduce((s, e) => s + e.amount, 0);
  const remaining = budget - spent;
  const pct       = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;

  async function saveBudget() {
    if (!activeTrip) return;
    const val = parseFloat(budgetInput) || 0;
    setBudget(val);
    await expensesApi.updateBudget(activeTrip._id, val).catch(() => {});
  }

  async function addExpense() {
    if (!activeTrip || !form.label || !form.amount) return;
    const exp = await expensesApi.create({
      tripId:   activeTrip._id,
      label:    form.label,
      amount:   parseFloat(form.amount),
      category: form.category,
      budget,
    });
    setExpenses((prev) => [exp, ...prev]);
    setForm({ label: "", amount: "", category: "misc" });
  }

  async function removeExpense(id) {
    await expensesApi.delete(id);
    setExpenses((prev) => prev.filter((e) => e._id !== id));
  }

  const fillColor = pct > 90 ? "from-red-400 to-red-600"
                  : pct > 70 ? "from-yellow-400 to-orange-400"
                  : "from-accent to-accent-dk";

  if (loading) return (
    <div className="p-12 flex items-center justify-center min-h-screen">
      <p className="font-display italic text-muted text-xl animate-pulse">Loading…</p>
    </div>
  );

  return (
    <div className="p-12 md:p-6 lg:p-12 min-h-screen">
      <PageHeader eyebrow="Keep the dream real" title="Trip <em>Budget</em>" />

      {/* Trip selector */}
      <div className="flex gap-2 flex-wrap mb-8">
        {trips.map((t) => (
          <button
            key={t._id}
            onClick={() => setActive(t)}
            className={`font-ui text-sm px-4 py-2 rounded-full border transition-all
              ${activeTrip?._id === t._id ? "bg-ink text-white border-ink" : "border-sand text-muted hover:border-ink hover:text-ink"}`}
          >
            {t.title}
          </button>
        ))}
        {!trips.length && (
          <p className="font-display italic text-muted">No trips yet — create one in Itinerary.</p>
        )}
      </div>

      {activeTrip && (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[
              { label: "Total Budget", value: fmt(budget), dark: false },
              { label: "Spent So Far",  value: fmt(spent),  dark: true  },
              { label: "Remaining",     value: fmt(Math.max(remaining, 0)), dark: false },
            ].map(({ label, value, dark }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-xl p-6 border ${dark ? "bg-ink border-ink" : "bg-cream border-sand"}`}
              >
                <p className={`font-mono text-[0.62rem] uppercase tracking-widest mb-2 ${dark ? "text-blue-300" : "text-muted"}`}>
                  {label}
                </p>
                <p className={`font-display text-4xl font-bold tracking-tight ${dark ? "text-white" : "text-ink"}`}>
                  {value}
                </p>
                {label === "Total Budget" && (
                  <input
                    type="number"
                    value={budgetInput}
                    onChange={(e) => setBudgetInput(e.target.value)}
                    onBlur={saveBudget}
                    onKeyDown={(e) => e.key === "Enter" && saveBudget()}
                    placeholder="Set budget…"
                    className="mt-3 w-full bg-transparent border-b border-sand text-sm text-muted outline-none
                               focus:border-accent placeholder:text-muted/60 pb-1 transition-colors"
                  />
                )}
              </motion.div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="mb-8">
            <div className="h-2.5 bg-sand rounded-full overflow-hidden mb-1.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.7, ease: [0.34, 1.2, 0.64, 1] }}
                className={`h-full rounded-full bg-gradient-to-r ${fillColor}`}
              />
            </div>
            <div className="flex justify-between font-mono text-[0.65rem] text-muted">
              <span>₹0</span><span>{fmt(budget)}</span>
            </div>
          </div>

          {/* Add expense form */}
          <div className="flex gap-3 flex-wrap mb-6">
            <input
              type="text"
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && addExpense()}
              placeholder="Expense label…"
              className="input-base flex-1 min-w-[180px]"
            />
            <input
              type="number"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && addExpense()}
              placeholder="Amount (₹)"
              className="input-base w-36"
            />
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="input-base w-40"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{CATEGORY_EMOJIS[c]} {c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
            <button onClick={addExpense} className="btn-rust">Add</button>
          </div>

          {/* Expense list */}
          <div className="flex flex-col gap-2">
            <AnimatePresence>
              {expenses.map((exp) => (
                <motion.div
                  key={exp._id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  className="flex items-center gap-3 px-4 py-3 bg-cream border border-sand rounded-lg"
                >
                  <span className="text-lg">{CATEGORY_EMOJIS[exp.category] || "◇"}</span>
                  <span className="flex-1 font-ui text-sm text-ink">{exp.label}</span>
                  <span className="font-mono text-sm font-medium text-forest">{fmt(exp.amount)}</span>
                  <button
                    onClick={() => removeExpense(exp._id)}
                    className="text-muted hover:text-red-500 transition-colors text-lg leading-none px-1"
                  >×</button>
                </motion.div>
              ))}
            </AnimatePresence>
            {expenses.length === 0 && (
              <p className="font-display italic text-muted text-center py-10">No expenses yet.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}