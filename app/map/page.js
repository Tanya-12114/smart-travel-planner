"use client";
// app/map/page.js
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import TravelMap from "@/components/map/TravelMap";
import { tripsApi } from "@/lib/api";
import PageHeader from "@/components/ui/PageHeader";
import { DESTINATIONS } from "@/lib/destinations";

function extractPins(trips) {
  const seen = new Set();
  const pins = [];
  trips.forEach((trip) => {
    trip.days?.forEach((day) => {
      day.events?.forEach((ev) => {
        const name = ev.name.toLowerCase();
        const match = DESTINATIONS.find(
          (d) => name.includes(d.name.toLowerCase()) && !seen.has(d.id)
        );
        if (match) { seen.add(match.id); pins.push(match); }
      });
    });
  });
  return pins;
}

export default function MapPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tripsApi.getAll()
      .then(setTrips)
      .catch(() => setTrips([]))
      .finally(() => setLoading(false));
  }, []);

  const pins = extractPins(trips);

  return (
    <div className="p-12 md:p-6 lg:p-12 min-h-screen">
      <PageHeader eyebrow="Your world, connected" title="Travel <em>Map</em>" />
      <motion.div
        initial={{ opacity: 0, scale: 0.99 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-xl overflow-hidden border border-sand h-[560px] bg-[#cdc6b0]"
      >
        <TravelMap trips={trips} />
        {/* Legend */}
        {pins.length > 0 && (
          <div className="absolute bottom-4 right-4 bg-ink/85 rounded-lg px-4 py-3 text-paper">
            <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted mb-2">Your Route</p>
            {pins.map((p, i) => (
              <div key={p.id} className="flex items-center gap-2 font-ui text-[0.75rem] text-sand mb-1">
                <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
                {i + 1}. {p.name}
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && pins.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center flex-col gap-3 text-muted">
            <span className="text-4xl">◎</span>
            <p className="font-display italic text-lg">Add destinations in the Itinerary to plot your route.</p>
          </div>
        )}
      </motion.div>

      {/* Trip list under map */}
      {pins.length > 0 && (
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {pins.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-cream border border-sand rounded-lg p-4 flex items-center gap-3"
            >
              <span className="text-2xl">{p.emoji}</span>
              <div>
                <p className="font-display font-semibold text-sm text-ink">{p.name}</p>
                <p className="font-mono text-[0.6rem] uppercase tracking-wider text-muted">{p.country}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}