"use client";
// app/itinerary/page.js
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "@/components/ui/PageHeader";
import DayBlock from "@/components/ui/DayBlock";
import { tripsApi } from "@/lib/api";

export default function ItineraryPage() {
  const [trips, setTrips]       = useState([]);
  const [activeTrip, setActive] = useState(null);
  const [saving, setSaving]     = useState(false);
  const [loading, setLoading]   = useState(true);

  // Load all trips
  useEffect(() => {
    tripsApi.getAll()
      .then((data) => {
        setTrips(data);
        if (data.length) setActive(data[0]);
      })
      .catch(() => setTrips([]))
      .finally(() => setLoading(false));
  }, []);

  const saveTrip = useCallback(async (trip) => {
    setSaving(true);
    try {
      const updated = await tripsApi.update(trip._id, trip);
      setTrips((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
      setActive(updated);
    } catch {}
    setSaving(false);
  }, []);

  async function createTrip() {
    const trip = await tripsApi.create({ title: "New Trip", destination: "", days: [] });
    setTrips((prev) => [trip, ...prev]);
    setActive(trip);
  }

  async function deleteTrip(id) {
    await tripsApi.delete(id);
    const remaining = trips.filter((t) => t._id !== id);
    setTrips(remaining);
    setActive(remaining[0] || null);
  }

  function addDay() {
    if (!activeTrip) return;
    const updated = {
      ...activeTrip,
      days: [...activeTrip.days, { _id: `local-${Date.now()}`, date: "", events: [] }],
    };
    setActive(updated);
    saveTrip(updated);
  }

  function updateDay(idx, newDay) {
    const days = activeTrip.days.map((d, i) => (i === idx ? newDay : d));
    const updated = { ...activeTrip, days };
    setActive(updated);
    saveTrip(updated);
  }

  function deleteDay(idx) {
    const days = activeTrip.days.filter((_, i) => i !== idx);
    const updated = { ...activeTrip, days };
    setActive(updated);
    saveTrip(updated);
  }

  function moveDay(from, to) {
    const days = [...activeTrip.days];
    const [moved] = days.splice(from, 1);
    days.splice(to, 0, moved);
    const updated = { ...activeTrip, days };
    setActive(updated);
    saveTrip(updated);
  }

  if (loading) {
    return (
      <div className="p-12 flex items-center justify-center min-h-screen">
        <p className="font-display italic text-muted text-xl animate-pulse">Loading trips…</p>
      </div>
    );
  }

  return (
    <div className="p-12 md:p-6 lg:p-12 min-h-screen">
      <PageHeader eyebrow="Your journey, composed" title="Day-by-Day <em>Plan</em>" />

      {/* Trip selector + controls */}
      <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
        <div className="flex items-center gap-3 flex-wrap">
          {trips.map((t) => (
            <button
              key={t._id}
              onClick={() => setActive(t)}
              className={`font-ui text-sm px-4 py-2 rounded-full border transition-all
                ${activeTrip?._id === t._id
                  ? "bg-ink text-white border-ink"
                  : "border-sand text-muted hover:border-ink hover:text-ink"
                }`}
            >
              {t.title}
            </button>
          ))}
          <button onClick={createTrip} className="font-mono text-xs text-accent hover:text-ink transition-colors">
            + New Trip
          </button>
        </div>
        <div className="flex gap-2">
          {saving && <span className="font-mono text-[0.65rem] text-muted animate-pulse self-center">Saving…</span>}
          {activeTrip && (
            <>
              <button onClick={addDay} className="btn-ghost text-xs">+ Add Day</button>
              <button
                onClick={() => deleteTrip(activeTrip._id)}
                className="border border-sand text-muted font-ui text-xs px-3 py-2 rounded hover:border-red-400 hover:text-red-500 transition-all"
              >Delete Trip</button>
            </>
          )}
        </div>
      </div>

      {/* Active trip title */}
      {activeTrip && (
        <div className="mb-6">
          <input
            value={activeTrip.title}
            onChange={(e) => setActive({ ...activeTrip, title: e.target.value })}
            onBlur={() => saveTrip(activeTrip)}
            className="bg-transparent border-b-2 border-sand focus:border-accent font-display text-2xl font-semibold
                       text-ink outline-none pb-1 transition-colors min-w-[260px]"
          />
        </div>
      )}

      {/* Days */}
      {activeTrip ? (
        <div className="flex flex-col gap-5">
          <AnimatePresence>
            {activeTrip.days.map((day, i) => (
              <DayBlock
                key={day._id || i}
                day={day}
                dayIndex={i}
                totalDays={activeTrip.days.length}
                onUpdate={(d) => updateDay(i, d)}
                onDelete={() => deleteDay(i)}
                onMoveUp={() => i > 0 && moveDay(i, i - 1)}
                onMoveDown={() => i < activeTrip.days.length - 1 && moveDay(i, i + 1)}
              />
            ))}
          </AnimatePresence>
          {activeTrip.days.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 text-muted"
            >
              <p className="text-4xl mb-4">◎</p>
              <p className="font-display italic text-lg">No days yet. Add one to start planning.</p>
            </motion.div>
          )}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-24 text-muted"
        >
          <p className="text-4xl mb-4">◈</p>
          <p className="font-display italic text-xl mb-6">No trips yet.</p>
          <button onClick={createTrip} className="btn-rust">Create your first trip →</button>
        </motion.div>
      )}
    </div>
  );
}