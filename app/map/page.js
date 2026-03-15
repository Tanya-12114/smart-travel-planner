"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import TravelMap from "@/components/map/TravelMap";
import { tripsApi } from "@/lib/api";
import PageHeader from "@/components/ui/PageHeader";

export default function MapPage() {
  const [trips,   setTrips]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tripsApi.getAll()
      .then(setTrips)
      .catch(() => setTrips([]))
      .finally(() => setLoading(false));
  }, []);

  // Server already geocoded missing coords — just filter valid ones
  const mappable = trips.filter((t) => t.lat != null && t.lng != null);

  return (
    <div className="p-12 md:p-6 lg:p-12 min-h-screen">
      <PageHeader eyebrow="Your world, connected" title="Travel <em>Map</em>" />

      <motion.div
        initial={{ opacity: 0, scale: 0.99 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-xl overflow-hidden border border-sand h-[560px]"
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-paper z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-sand border-t-accent" />
          </div>
        )}

        <TravelMap trips={mappable} />

        {/* Legend */}
        {mappable.length > 0 && (
          <div className="absolute bottom-4 right-4 bg-ink/90 rounded-lg px-4 py-3 z-10">
            <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted mb-2">
              Your Destinations
            </p>
            {mappable.map((t, i) => (
              <div key={t._id} className="flex items-center gap-2 font-ui text-[0.75rem] text-white/70 mb-1">
                <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
                {i + 1}. {t.destination || t.title}
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && mappable.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center flex-col gap-3 text-muted">
            <span className="text-4xl">◎</span>
            <p className="font-display italic text-lg">
              Add destinations from Discover to plot your route.
            </p>
          </div>
        )}
      </motion.div>

      {/* Trip cards */}
      {mappable.length > 0 && (
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {mappable.map((t, i) => (
            <motion.div
              key={t._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white border border-sand rounded-lg p-4"
            >
              <p className="font-ui font-semibold text-sm text-ink">
                {t.destination || t.title}
              </p>
              <p className="font-mono text-[0.6rem] uppercase tracking-wider text-muted mt-1">
                {t.days?.length ?? 0} day{t.days?.length !== 1 ? "s" : ""}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}