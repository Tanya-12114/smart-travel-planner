"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TravelMap from "@/components/map/TravelMap";
import { tripsApi } from "@/lib/api";
import PageHeader from "@/components/ui/PageHeader";

export default function MapPage() {
  const [trips,        setTrips]        = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [locStatus,    setLocStatus]    = useState("pending");
  const [selected,     setSelected]     = useState(null); // selected trip _id

  useEffect(() => {
    if (!navigator.geolocation) { setLocStatus("denied"); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
        setLocStatus("granted");
      },
      () => setLocStatus("denied"),
      { timeout: 8000 }
    );
  }, []);

  useEffect(() => {
    tripsApi.getAll()
      .then((data) => {
        setTrips(data);
        // Auto-select first trip
        const first = data.find((t) => t.lat != null && t.lng != null);
        if (first) setSelected(first._id);
      })
      .catch(() => setTrips([]))
      .finally(() => setLoading(false));
  }, []);

  const mappable = trips.filter((t) => t.lat != null && t.lng != null);
  const activeTrip = mappable.find((t) => t._id === selected) || null;

  return (
    <div className="p-12 md:p-6 lg:p-12 min-h-screen">
      <PageHeader eyebrow="Your world, connected" title="Travel <em>Map</em>" />

      {locStatus === "denied" && mappable.length > 0 && (
        <div className="mb-4 flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 max-w-xl">
          <span className="text-amber-500 text-sm">⚠</span>
          <p className="font-ui text-sm text-amber-700">
            Location access denied — enable it to see flight routes from your location.
          </p>
        </div>
      )}

      {/* Map */}
      <motion.div
        initial={{ opacity: 0, scale: 0.99 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-xl overflow-hidden border border-sand h-[520px]"
      >
        {(loading || locStatus === "pending") && (
          <div className="absolute inset-0 flex items-center justify-center bg-paper z-10 flex-col gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-sand border-t-accent" />
            <p className="font-mono text-[0.65rem] uppercase tracking-widest text-muted">
              {loading ? "Loading trips…" : "Getting your location…"}
            </p>
          </div>
        )}

        {/* Pass only the selected trip for routing */}
        <TravelMap
          trips={activeTrip ? [activeTrip] : mappable}
          userLocation={userLocation}
        />

        {/* Route badge */}
        {userLocation && activeTrip && (
          <div className="absolute top-4 left-4 bg-ink/80 rounded-lg px-3 py-1.5 z-10 flex items-center gap-2">
            <span className="text-sm">✈</span>
            <p className="font-mono text-[0.6rem] uppercase tracking-widest text-white/70">
              Route to {activeTrip.destination || activeTrip.title}
            </p>
          </div>
        )}

        {/* Empty state */}
        {!loading && mappable.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center flex-col gap-3 text-muted z-10">
            <span className="text-4xl">◎</span>
            <p className="font-display italic text-lg">
              Add destinations from Discover to plot your route.
            </p>
          </div>
        )}
      </motion.div>

      {/* Destination selector */}
      {mappable.length > 0 && (
        <div className="mt-6">
          <p className="eyebrow mb-4">Select a destination to view its route</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            <AnimatePresence>
              {mappable.map((t, i) => {
                const isActive = t._id === selected;
                return (
                  <motion.button
                    key={t._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    onClick={() => setSelected(t._id)}
                    className={`text-left rounded-xl p-4 border transition-all
                      ${isActive
                        ? "bg-accent border-accent text-white shadow-lg shadow-accent/20"
                        : "bg-white border-sand text-ink hover:border-accent/40 hover:shadow-md"
                      }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${isActive ? "bg-white" : "bg-amber-400"}`} />
                      <p className="font-ui font-semibold text-sm truncate">
                        {t.destination || t.title}
                      </p>
                    </div>
                    <p className={`font-mono text-[0.6rem] uppercase tracking-wider ${isActive ? "text-white/70" : "text-muted"}`}>
                      {t.days?.length ?? 0} day{t.days?.length !== 1 ? "s" : ""} planned
                    </p>
                    {isActive && (
                      <p className="font-mono text-[0.58rem] uppercase tracking-wider text-white/60 mt-1.5">
                        ✈ Route shown
                      </p>
                    )}
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}