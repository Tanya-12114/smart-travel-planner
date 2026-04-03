"use client";
import { motion } from "framer-motion";
import { useState } from "react";

// ── Clean SVG icon set — replaces emojis ──────────────────────
const EVENT_ICONS = {
  flight:    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4"><path d="M10.5 2.5a1.5 1.5 0 0 1 2.12 0l4.38 4.38a1.5 1.5 0 0 1 0 2.12L13.5 12.5l1.5 4.5-2 .5-2-3.5-3 3-1-1 1.5-4L4 8.5 4.5 6.5l4.5 1.5 1.5-1.5a1.5 1.5 0 0 1 0-4Z" fill="currentColor" opacity=".15"/><path d="M17 3L3 9l5 2 2 5 3-3-1-3 3-3-1-5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>,
  hotel:     <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4"><rect x="3" y="7" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><path d="M7 17V10h6v7" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M3 7l7-4 7 4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><rect x="8.5" y="11.5" width="3" height="3" rx=".5" stroke="currentColor" strokeWidth="1"/></svg>,
  food:      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4"><path d="M6 2v4a3 3 0 0 0 3 3v9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M9 2v4M12 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M14 2c0 4-2 7-2 7v9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  museum:    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4"><path d="M3 17h14M4 17V9M8 17V9M12 17V9M16 17V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M2 9l8-6 8 6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>,
  beach:     <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4"><path d="M2 15c4-6 12-6 16 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.5"/><path d="M10 10v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  hike:      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4"><path d="M4 17l4-7 3 3 3-6 3 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 17h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  temple:    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4"><path d="M10 2l2 3h4v2H4V5h4l2-3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M5 7v10M15 7v10M8 7v10M12 7v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M3 17h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  shop:      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4"><path d="M3 6h14l-1.5 8H4.5L3 6Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M3 6l1-3h12l1 3" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><circle cx="7.5" cy="17" r="1" fill="currentColor"/><circle cx="12.5" cy="17" r="1" fill="currentColor"/></svg>,
  train:     <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4"><rect x="5" y="3" width="10" height="11" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M5 9h10" stroke="currentColor" strokeWidth="1.5"/><circle cx="7.5" cy="12" r="1" fill="currentColor"/><circle cx="12.5" cy="12" r="1" fill="currentColor"/><path d="M7 14l-2 3M13 14l2 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  drinks:    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4"><path d="M6 3h8l-2 8H8L6 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M8 11v6M12 11v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M6 17h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M10 3v3l2-1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  show:      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4"><path d="M3 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5Z" stroke="currentColor" strokeWidth="1.5"/><path d="M8 8l4 2-4 2V8Z" fill="currentColor"/></svg>,
  spa:       <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4"><path d="M10 3c0 4-5 6-5 10h10c0-4-5-6-5-10Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M10 3c0 4 5 6 5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M7 17h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  explore:   <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4"><circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5"/><path d="M13 7l-2 4-4 2 2-4 4-2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>,
  default:   <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4"><circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5"/><circle cx="10" cy="10" r="2" fill="currentColor"/></svg>,
};

// Map keywords → icon key
function resolveIcon(name = "") {
  const n = name.toLowerCase();
  if (/flight|fly|airport|arrive|depart|land/.test(n))                    return "flight";
  if (/hotel|stay|riad|hostel|airbnb|inn|check.in|check.out/.test(n))     return "hotel";
  if (/lunch|dinner|breakfast|eat|restaurant|café|cafe|food|brunch/.test(n)) return "food";
  if (/museum|art|gallery|exhibit/.test(n))                               return "museum";
  if (/beach|sea|ocean|swim|surf|coast/.test(n))                          return "beach";
  if (/hike|trek|trail|mountain|walk|climb/.test(n))                      return "hike";
  if (/temple|shrine|church|mosque|cathedral|pagoda/.test(n))             return "temple";
  if (/market|souk|shop|bazaar|mall/.test(n))                             return "shop";
  if (/train|bus|metro|taxi|transfer|transit|transport/.test(n))          return "train";
  if (/wine|bar|cocktail|drink|beer|pub/.test(n))                         return "drinks";
  if (/show|concert|event|festival|theater|theatre/.test(n))              return "show";
  if (/spa|massage|wellness|yoga|relax/.test(n))                          return "spa";
  if (/explore|discover|visit|tour|see|wander/.test(n))                   return "explore";
  return "default";
}

export default function DayBlock({ day, dayIndex, totalDays, onUpdate, onDelete, onMoveUp, onMoveDown }) {
  const [newEvent, setNewEvent] = useState("");

  function addEvent() {
    if (!newEvent.trim()) return;
    onUpdate({ ...day, events: [...(day.events || []), { name: newEvent.trim() }] });
    setNewEvent("");
  }

  function removeEvent(i) {
    onUpdate({ ...day, events: day.events.filter((_, idx) => idx !== i) });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="bg-white border border-sand rounded-xl p-5"
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
            onChange={(e) => onUpdate({ ...day, date: e.target.value })}
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
          >✕</button>
        </div>
      </div>

      {/* Events */}
      <div className="flex flex-col gap-1.5 mb-3">
        {(day.events || []).map((ev, i) => {
          const iconKey = resolveIcon(ev.name || ev.emoji || "");
          return (
            <div key={i} className="flex items-center gap-3 px-3 py-2.5 bg-paper border border-sand/60 rounded-lg group">
              <span className="text-accent flex-shrink-0">
                {EVENT_ICONS[iconKey]}
              </span>
              <span className="flex-1 font-ui text-sm text-ink">{ev.name}</span>
              <button
                onClick={() => removeEvent(i)}
                className="text-muted hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 text-base leading-none px-1"
              >×</button>
            </div>
          );
        })}
        {(!day.events || day.events.length === 0) && (
          <p className="text-ink text-sm px-1 py-2">No events yet.</p>
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