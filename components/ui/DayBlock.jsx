"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { guessEmoji } from "@/lib/destinations";

export default function DayBlock({ day, dayIndex, totalDays, onUpdate, onDelete, onMoveUp, onMoveDown }) {
  const [newEvent, setNewEvent] = useState("");

  function addEvent() {
    if (!newEvent.trim()) return;
    const event = { name: newEvent.trim(), emoji: guessEmoji(newEvent) };
    onUpdate({ ...day, events: [...(day.events || []), event] });
    setNewEvent("");
  }

  function removeEvent(i) {
    onUpdate({ ...day, events: day.events.filter((_, idx) => idx !== i) });
  }

  function updateDate(val) {
    onUpdate({ ...day, date: val });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="bg-cream border border-sand rounded-xl p-5"
    >
      {/* Day header */}
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[0.65rem] uppercase tracking-widest text-accent bg-accent/10 px-2 py-1 rounded">
            Day {dayIndex + 1}
          </span>
          <input
            type="date"
            value={day.date || ""}
            onChange={(e) => updateDate(e.target.value)}
            className="input-base text-xs py-1.5"
          />
        </div>
        <div className="flex items-center gap-1">
          {dayIndex > 0 && (
            <button onClick={onMoveUp} className="btn-ghost text-xs px-2 py-1">↑</button>
          )}
          {dayIndex < totalDays - 1 && (
            <button onClick={onMoveDown} className="btn-ghost text-xs px-2 py-1">↓</button>
          )}
          <button
            onClick={onDelete}
            className="border border-sand text-muted font-ui text-xs px-2 py-1 rounded hover:border-red-400 hover:text-red-500 transition-all"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Events */}
      <div className="flex flex-col gap-2 mb-3">
        {(day.events || []).map((ev, i) => (
          <div key={i} className="flex items-center gap-3 px-3 py-2 bg-paper border border-sand/60 rounded-lg group">
            <span className="text-base">{ev.emoji || "📌"}</span>
            <span className="flex-1 font-ui text-sm text-ink">{ev.name}</span>
            <button
              onClick={() => removeEvent(i)}
              className="text-muted hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 text-lg leading-none px-1"
            >×</button>
          </div>
        ))}
        {(!day.events || day.events.length === 0) && (
          <p className="font-display italic text-muted/60 text-sm px-1">No events yet.</p>
        )}
      </div>

      {/* Add event */}
      <div className="flex gap-2 mt-2">
        <input
          type="text"
          value={newEvent}
          onChange={(e) => setNewEvent(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addEvent()}
          placeholder="Add an event…"
          className="input-base flex-1 text-sm py-2"
        />
        <button onClick={addEvent} className="btn-ghost text-xs px-3 py-2">Add</button>
      </div>
    </motion.div>
  );
}