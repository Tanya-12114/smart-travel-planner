// app/api/destinations/route.js
// Geocoding   : Nominatim (free, no key)
// Description : Wikipedia REST API (free, no key)  
// Best time   : Open-Meteo Climate API — real 30-year monthly averages (free, no key)
// Avg cost    : World Bank GDP per capita (free, no key)

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || "").trim();
  if (!q || q.length < 2) return Response.json([]);

  try {
    // ── Step 1: Geocode ───────────────────────────────────────
    const geoUrl = [
      `https://nominatim.openstreetmap.org/search`,
      `?q=${encodeURIComponent(q)}`,
      `&format=json&limit=8&addressdetails=1&namedetails=1`,
      `&accept-language=en`,
    ].join("");

    const geoRes = await fetch(geoUrl, {
      headers: { "User-Agent": "VoyagrTravelApp/1.0", "Accept-Language": "en" },
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

    const filtered = geoData
      .filter((p) => p.type !== "postcode" && p.type !== "road" && p.type !== "path")
      .slice(0, 8);

    // ── Step 2: Parallel fetch — climate + GDP + wiki ─────────
    const countryCodes = [...new Set(
      filtered.map((p) => p.address?.country_code?.toUpperCase()).filter(Boolean)
    )];

    const [gdpMap, ...climateAndWiki] = await Promise.all([
      fetchGDPMap(countryCodes),
      // Climate for top 4 places + wiki for top 4
      ...filtered.slice(0, 4).map((p) =>
        Promise.all([
          fetchClimate(parseFloat(p.lat), parseFloat(p.lon)),
          fetchWikiSummary(
            (p.namedetails?.["name:en"] || p.namedetails?.["name"] || p.name || "")
          ),
        ])
      ),
    ]);

    // climateAndWiki = [[climate0,wiki0],[climate1,wiki1],...]
    const enrichments = climateAndWiki;

    // ── Step 3: Build results ─────────────────────────────────
    const results = filtered.map((place, i) => {
      const addr    = place.address     || {};
      const names   = place.namedetails || {};
      const name    =
        names["name:en"] || names["name"] ||
        place.name || place.display_name.split(",")[0].trim();
      const country     = addr.country || place.display_name.split(",").pop().trim();
      const countryCode = addr.country_code?.toUpperCase() || "";
      const state       = addr.state || addr.county || "";
      const badge       = typeMap[place.type] || typeMap[place.class] || "Place";
      const lat         = parseFloat(place.lat);
      const lon         = parseFloat(place.lon);
      const tags        = [...new Set([
        badge !== "Place" ? badge : null,
        state && state !== country ? state : null,
        country,
      ].filter(Boolean))].slice(0, 3);

      const [climate, wiki] = enrichments[i] || [null, null];
      const gdp = gdpMap[countryCode] || null;

      return {
        id:          `dyn-${i}-${name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
        name, country, badge, tags,
        description: wiki || `${name}, ${country} — a destination worth exploring.`,
        bestTime:    climate ? deriveBestTime(climate, lat) : fallbackBestTime(lat, lon),
        avgCost:     calcAvgCost(gdp, country),
        coordinates: { lat, lon },
        isDynamic:   true,
      };
    });

    return Response.json(results);

  } catch (err) {
    console.error("Destination search error:", err.message);
    return Response.json([], { status: 500 });
  }
}

// ─────────────────────────────────────────────────────────────
// Open-Meteo Climate API
// Returns 30-year monthly normals: temp + precipitation
// Endpoint: climate-api.open-meteo.com (different from forecast)
// ─────────────────────────────────────────────────────────────
async function fetchClimate(lat, lon) {
  try {
    const url = [
      `https://climate-api.open-meteo.com/v1/climate`,
      `?latitude=${lat}&longitude=${lon}`,
      `&start_year=1991&end_year=2020`,
      `&monthly=temperature_2m_mean,precipitation_sum,wind_speed_10m_mean`,
      `&models=EC_Earth3P_HR`,
    ].join("");

    const res = await fetch(url, { next: { revalidate: 86400 * 30 } }); // cache 30 days
    if (!res.ok) return null;
    const data = await res.json();

    if (!data.monthly) return null;

    return {
      temp:  data.monthly.temperature_2m_mean  || [],  // 12 monthly values °C
      rain:  data.monthly.precipitation_sum    || [],  // 12 monthly values mm
      wind:  data.monthly.wind_speed_10m_mean  || [],  // 12 monthly values km/h
    };
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// Derive best travel months from real climate data
//
// Scoring per month (higher = better to visit):
//  +3  if temp 18–28°C (comfortable)
//  +2  if temp 10–18°C or 28–33°C (acceptable)
//  +0  if temp <5°C or >35°C (extreme)
//  +3  if rain < 40mm (dry)
//  +1  if rain 40–80mm (moderate)
//  -1  if rain > 120mm (very wet)
//  +1  if wind < 20 km/h (calm)
//
// Returns the best consecutive 3–4 month window
// ─────────────────────────────────────────────────────────────
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function deriveBestTime(climate, lat) {
  const { temp, rain, wind } = climate;
  if (!temp.length || !rain.length) return fallbackBestTime(lat, 0);

  // Score each month
  const scores = temp.map((t, i) => {
    let score = 0;
    const r = rain[i] ?? 60;
    const w = wind[i] ?? 20;

    // Temperature score
    if      (t >= 18 && t <= 28)  score += 3;
    else if (t >= 10 && t <= 33)  score += 2;
    else if (t >= 5  && t <= 35)  score += 1;
    // else 0 — extreme cold or heat

    // Rain score
    if      (r < 40)   score += 3;
    else if (r < 80)   score += 1;
    else if (r > 120)  score -= 1;

    // Wind score
    if (w < 20) score += 1;

    return score;
  });

  // Find the best consecutive window of 3–4 months
  // Try window sizes 4, 3 — pick whichever gives highest total
  let bestWindow = { start: 0, len: 3, total: -Infinity };

  for (const len of [4, 3]) {
    for (let start = 0; start < 12; start++) {
      let total = 0;
      for (let j = 0; j < len; j++) {
        total += scores[(start + j) % 12];
      }
      if (total > bestWindow.total) {
        bestWindow = { start, len, total };
      }
    }
  }

  const { start, len } = bestWindow;
  const endIdx = (start + len - 1) % 12;
  return `${MONTHS[start]}–${MONTHS[endIdx]}`;
}

// Pure-geography fallback if climate API fails
function fallbackBestTime(lat, lon) {
  const abs = Math.abs(lat);
  const s   = lat < 0;
  if (abs > 60) return s ? "Dec–Feb" : "Jun–Aug";
  if (abs > 45) return s ? "Dec–Mar" : "May–Sep";
  if (abs > 30) {
    if (lon > 90 && lon < 150) return "Mar–May, Sep–Nov";
    return s ? "Oct–Apr" : "Apr–Jun, Sep–Oct";
  }
  if (abs > 20) return s ? "Apr–Oct" : (lon > 60 && lon < 130 ? "Oct–Mar" : "Nov–Apr");
  return s ? "May–Sep" : "Nov–Mar";
}

// ─────────────────────────────────────────────────────────────
// World Bank GDP per capita → daily INR travel cost
// ─────────────────────────────────────────────────────────────
async function fetchGDPMap(codes) {
  if (!codes.length) return {};
  try {
    const url = `https://api.worldbank.org/v2/country/${codes.join(";")}/indicator/NY.GDP.PCAP.CD?format=json&mrv=1&per_page=50`;
    const res = await fetch(url, { next: { revalidate: 86400 * 7 } });
    if (!res.ok) return {};
    const data    = await res.json();
    const records = data[1] || [];
    const map     = {};
    records.forEach((r) => {
      if (r?.country?.id && r?.value) {
        map[r.country.id]    = r.value; // ISO2
        map[r.countryiso3code] = r.value; // ISO3
      }
    });
    return map;
  } catch {
    return {};
  }
}

function calcAvgCost(gdpPerCapita, country = "") {
  const INR = 84;
  if (gdpPerCapita) {
    const daily = gdpPerCapita / 365;
    let mult;
    if      (gdpPerCapita < 2000)  mult = 4.0;
    else if (gdpPerCapita < 5000)  mult = 3.0;
    else if (gdpPerCapita < 12000) mult = 2.5;
    else if (gdpPerCapita < 25000) mult = 2.0;
    else if (gdpPerCapita < 50000) mult = 1.6;
    else                           mult = 1.3;
    const inr     = Math.min(Math.max(daily * mult * INR, 2100), 38000);
    const rounded = Math.round(inr / 500) * 500;
    return `₹${rounded.toLocaleString("en-IN")}/day`;
  }
  const c = country.toLowerCase();
  if (/africa/.test(c))                         return "₹5,000/day";
  if (/asia|india|pakistan|bangladesh/.test(c)) return "₹6,000/day";
  if (/europe/.test(c))                         return "₹12,000/day";
  if (/america|canada|australia/.test(c))       return "₹15,000/day";
  return "₹8,000/day";
}

// ─────────────────────────────────────────────────────────────
// Wikipedia — first 2 sentences
// ─────────────────────────────────────────────────────────────
async function fetchWikiSummary(name) {
  try {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`;
    const res = await fetch(url, {
      headers: { "User-Agent": "VoyagrTravelApp/1.0" },
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;
    const data      = await res.json();
    const sentences = (data.extract || "").match(/[^.!?]+[.!?]+/g) || [];
    return sentences.slice(0, 2).join(" ").trim() || null;
  } catch {
    return null;
  }
}