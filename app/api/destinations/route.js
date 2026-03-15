// app/api/destinations/route.js — Next.js App Router API route
// Proxies to Nominatim (OpenStreetMap) — no API key needed

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || "").trim();

  if (!q || q.length < 2) return Response.json([]);

  try {
    // accept-language=en  → forces all names/addresses returned in English
    // namedetails=1       → includes name:en as explicit fallback
    const geoUrl = [
      `https://nominatim.openstreetmap.org/search`,
      `?q=${encodeURIComponent(q)}`,
      `&format=json&limit=8&addressdetails=1&namedetails=1`,
      `&accept-language=en`,
    ].join("");

    const geoRes = await fetch(geoUrl, {
      headers: {
        "User-Agent":       "VoyagrTravelApp/1.0",
        "Accept-Language":  "en",           // HTTP header — belt-and-suspenders
      },
      next: { revalidate: 300 },
    });

    if (!geoRes.ok) return Response.json([]);

    const geoData = await geoRes.json();
    if (!geoData.length) return Response.json([]);

    const typeMap = {
      city: "City", town: "Town", village: "Village",
      country: "Country", state: "Region", island: "Island",
      beach: "Beach", mountain: "Mountain", park: "Park",
      natural: "Nature", tourism: "Tourism",
    };

    const results = geoData
      .filter((p) => p.type !== "postcode" && p.type !== "road" && p.type !== "path")
      .slice(0, 8)
      .map((place, i) => {
        const addr     = place.address    || {};
        const names    = place.namedetails || {};

        // Priority: English name → generic name → first segment of display_name
        const name =
          names["name:en"] ||
          names["name"]    ||
          place.name       ||
          place.display_name.split(",")[0].trim();

        // English country name from address details
        const country =
          addr["country"] ||
          place.display_name.split(",").pop().trim();

        const state  = addr.state || addr.county || "";
        const badge  = typeMap[place.type] || typeMap[place.class] || "Place";

        const tags = [];
        if (badge !== "Place") tags.push(badge);
        if (state   && state   !== country) tags.push(state);
        if (country)                        tags.push(country);

        return {
          id:          `dyn-${i}-${name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
          name,
          country,
          badge,
          tags:        [...new Set(tags)].slice(0, 3),
          description: `${name}${state ? `, ${state}` : ""}, ${country}.`,
          bestTime:    "Check local guides",
          avgCost:     "Varies",
          coordinates: { lat: parseFloat(place.lat), lon: parseFloat(place.lon) },
          isDynamic:   true,
        };
      });

    return Response.json(results);

  } catch (err) {
    console.error("Destination search error:", err.message);
    return Response.json([], { status: 500 });
  }
}