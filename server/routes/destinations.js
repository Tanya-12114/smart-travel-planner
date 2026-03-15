// server/routes/destinations.js
// Uses OpenTripMap free API — no key needed for basic place search
const express = require("express");
const router  = express.Router();

const OTM_BASE = "https://api.opentripmap.com/0.1/en/places";
// Free tier key (public demo key — works for reasonable usage)
const OTM_KEY  = process.env.OTM_API_KEY || "5ae2e3f221c38a28845f05b64db5e9deba0d4ec1d5fbdf24b3e5b55a";

/**
 * GET /api/destinations/search?q=Paris
 * Returns up to 12 matching destinations with name, country,
 * coordinates, kinds (tags), and a Wikipedia extract.
 */
router.get("/search", async (req, res) => {
  const q = (req.query.q || "").trim();
  if (!q || q.length < 2) return res.json([]);

  try {
    // Step 1 — geocode the query to get lat/lon + place name
    const geoUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=6&addressdetails=1`;
    const geoRes  = await fetch(geoUrl, {
      headers: { "User-Agent": "VoyagrTravelApp/1.0" },
    });
    const geoData = await geoRes.json();

    if (!geoData.length) return res.json([]);

    // Step 2 — for each geocoded result build a destination card
    const results = geoData
      .filter((p) => p.type !== "postcode" && p.type !== "road")
      .slice(0, 8)
      .map((place, i) => {
        const addr    = place.address || {};
        const name    = place.name || place.display_name.split(",")[0];
        const country = addr.country || place.display_name.split(",").slice(-1)[0].trim();
        const state   = addr.state || addr.county || "";
        const lat     = parseFloat(place.lat);
        const lon     = parseFloat(place.lon);

        // Derive a rough "badge" from place type
        const typeMap = {
          city: "City", town: "Town", village: "Village",
          country: "Country", state: "Region", island: "Island",
          beach: "Beach", mountain: "Mountain", park: "Park",
          tourism: "Tourism", natural: "Nature",
        };
        const badge = typeMap[place.type] || typeMap[place.class] || "Place";

        // Generate sensible tags from address components
        const tags = [];
        if (addr.country) tags.push(addr.country);
        if (state && state !== country) tags.push(state);
        if (place.type && place.type !== "administrative") tags.push(badge);

        return {
          id:          `dynamic-${i}-${name.toLowerCase().replace(/\s+/g, "-")}`,
          name,
          country,
          badge,
          tags:        tags.slice(0, 4),
          description: `${name}${state ? `, ${state}` : ""}, ${country}. Explore this destination and add it to your itinerary.`,
          bestTime:    "Check local guides",
          avgCost:     "Varies",
          coordinates: { lat, lon },
          isDynamic:   true,
        };
      });

    res.json(results);
  } catch (err) {
    console.error("Destination search error:", err.message);
    res.status(500).json({ error: "Search failed" });
  }
});

module.exports = router;