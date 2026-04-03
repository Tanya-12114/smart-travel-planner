"use client";
// app/page.js — Discover / Search
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DESTINATIONS } from "@/lib/destinations";
import { tripsApi, destinationsApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import DestinationIcon from "@/components/ui/DestinationIcon";

export default function DiscoverPage() {
  const [query, setQuery]         = useState("");
  const [selected, setSelected]   = useState(null);
  const [loading, setLoading]     = useState(false);
  const [searching, setSearching] = useState(false);
  const [toast, setToast]         = useState("");
  const [dynamicResults, setDynamic] = useState([]);
  const debounceRef = useRef(null);
  const router = useRouter();

  // Debounced search — fires 400ms after the user stops typing
  useEffect(() => {
    const q = query.trim();

    // If empty, clear dynamic results and bail
    if (!q) { setDynamic([]); setSearching(false); return; }

    // Check if query already matches a hardcoded destination well
    const hardcoded = DESTINATIONS.filter((d) =>
      d.name.toLowerCase().includes(q.toLowerCase()) ||
      d.country.toLowerCase().includes(q.toLowerCase()) ||
      d.tags.some((t) => t.toLowerCase().includes(q.toLowerCase()))
    );

    // If we have a strong local hit and query is short, skip API
    if (hardcoded.length >= 3 && q.length < 5) {
      setDynamic([]);
      return;
    }

    clearTimeout(debounceRef.current);
    setSearching(true);

    debounceRef.current = setTimeout(async () => {
      try {
        const results = await destinationsApi.search(q);
        setDynamic(results);
      } catch {
        setDynamic([]);
      } finally {
        setSearching(false);
      }
    }, 400);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  // Merged results — hardcoded first, then dynamic ones that don't duplicate
  const hardcoded = query.trim()
    ? DESTINATIONS.filter((d) =>
        d.name.toLowerCase().includes(query.toLowerCase()) ||
        d.country.toLowerCase().includes(query.toLowerCase()) ||
        d.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
      )
    : DESTINATIONS;

  const deduped = dynamicResults.filter(
    (d) => !hardcoded.some((h) => h.name.toLowerCase() === d.name.toLowerCase())
  );

  const results = [...hardcoded, ...deduped];

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  async function handleAddToItinerary() {
    if (!selected) return;
    setLoading(true);
    try {
      await tripsApi.create({
        title: `Trip to ${selected.name}`,
        destination: selected.name,
        // Save coordinates so the map can pin any destination
        lat: selected.coordinates?.lat ?? null,
        lng: selected.coordinates?.lon ?? selected.coordinates?.lng ?? null,
        days: [
          {
            date: "",
            events: [
              { name: `Arrive in ${selected.name}`, emoji: "✈️" },
              { name: `Explore ${selected.name}`,   emoji: "📌" },
            ],
          },
        ],
      });
      showToast(`"${selected.name}" added to itinerary!`);
      setTimeout(() => router.push("/itinerary"), 1200);
    } catch {
      router.push("/itinerary");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-12 md:p-6 lg:p-12 min-h-screen">
      {/* Header */}
      <p className="eyebrow mb-2">Where to next?</p>
      <h1 className="page-title mb-8">
        Discover <em>Destinations</em>
      </h1>

      {/* Search bar */}
      <div className="flex gap-3 mb-3 max-w-2xl">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && setQuery("")}
            placeholder="Search any city, country, region…"
            className="input-base w-full font-display text-base pr-10"
          />
          {searching && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 font-ui text-sm text-ink animate-pulse">
              searching…
            </span>
          )}
        </div>
        <button onClick={() => { setQuery(""); setSelected(null); }} className="btn-primary">
          <span>Clear</span>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Result count hint */}
      <p className="font-ui text-sm text-ink mb-8">
        {query.trim()
          ? `${results.length} destination${results.length !== 1 ? "s" : ""} found`
          : `${DESTINATIONS.length} featured destinations`}
      </p>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 mb-10">
        <AnimatePresence>
          {results.map((dest, i) => (
            <motion.div
              key={dest.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: Math.min(i * 0.04, 0.3) }}
              onClick={() => setSelected(dest)}
              className={`bg-cream border rounded-xl p-5 card-hover cursor-pointer transition-all
                ${selected?.id === dest.id ? "border-accent ring-1 ring-accent/30" : "border-sand"}
                ${dest.isDynamic ? "border-dashed" : ""}`}
            >
              <div className="flex items-start justify-between mb-3">
                <DestinationIcon id={dest.id} className="w-14 h-14" />
                <div className="flex flex-col items-end gap-1">
                  <span className="tag-pill">{dest.badge}</span>
                  {dest.isDynamic && (
                    <span className="font-ui text-sm text-ink tracking-normal">live</span>
                  )}
                </div>
              </div>
              <h3 className="font-display text-lg font-semibold text-ink">{dest.name}</h3>
              <p className="font-ui text-sm font-medium text-ink mt-0.5">{dest.country}</p>
              <div className="flex flex-wrap gap-1 mt-3">
                {dest.tags.slice(0, 2).map((t) => (
                  <span key={t} className="tag-pill">{t}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Empty state */}
        {!searching && results.length === 0 && query.trim() && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full text-center py-16"
          >
            <p className="text-3xl mb-3">◎</p>
            <p className="font-ui text-base font-medium text-ink text-lg">No results for &ldquo;{query}&rdquo;</p>
            <p className="font-ui text-sm text-ink mt-2">Try a different spelling or broader term</p>
          </motion.div>
        )}

        {/* Searching skeleton */}
        {searching && results.length === 0 && (
          <>
            {[1,2,3].map((n) => (
              <div key={n} className="bg-cream border border-sand rounded-xl p-5 animate-pulse">
                <div className="w-14 h-14 bg-sand rounded-lg mb-3"/>
                <div className="h-4 bg-sand rounded w-2/3 mb-2"/>
                <div className="h-3 bg-sand rounded w-1/2"/>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Selected panel */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="border border-accent/20 rounded-xl p-6 bg-accent-lt max-w-3xl"
          >
            <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
              <div>
                <p className="eyebrow mb-1">Selected Destination</p>
                <h2 className="font-display text-3xl font-bold text-ink">
                  {selected.name}
                </h2>
              </div>
              <button
                onClick={handleAddToItinerary}
                disabled={loading}
                className="btn-rust whitespace-nowrap"
              >
                {loading ? "Adding…" : "Add to Itinerary →"}
              </button>
            </div>

            <p className="text-sm text-ink font-ui mb-2">
              <strong className="text-ink">📍 {selected.country}</strong>
              &nbsp;·&nbsp;
              <strong className="text-ink">🗓 Best time:</strong> {selected.bestTime}
              &nbsp;·&nbsp;
              <strong className="text-ink">💰 Avg cost:</strong> {selected.avgCost}
            </p>
            <p className="font-ui text-base text-ink text-base leading-relaxed">
              {selected.description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-8 right-8 bg-ink text-white font-ui text-sm font-semibold
                       px-5 py-3 rounded-lg shadow-2xl z-50"
          >
            ✓ {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}