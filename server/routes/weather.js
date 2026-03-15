// server/routes/weather.js — Live weather via Open-Meteo (free, no API key needed)
// Geocoding: nominatim.openstreetmap.org → lat/lon
// Weather:   api.open-meteo.com → current + 7-day forecast

const express = require("express");
const router  = express.Router();

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// WMO Weather interpretation codes → icon keyword + description
// https://open-meteo.com/en/docs#weathervariables
function wmoToCondition(code) {
  if (code === 0)                return { icon: "sunny",         desc: "Clear sky" };
  if (code === 1)                return { icon: "sunny",         desc: "Mainly clear" };
  if (code === 2)                return { icon: "partly-cloudy", desc: "Partly cloudy" };
  if (code === 3)                return { icon: "cloudy",        desc: "Overcast" };
  if ([45, 48].includes(code))   return { icon: "foggy",         desc: "Foggy" };
  if ([51, 53, 55].includes(code)) return { icon: "rainy",       desc: "Drizzle" };
  if ([56, 57].includes(code))   return { icon: "snowy",         desc: "Freezing drizzle" };
  if ([61, 63, 65].includes(code)) return { icon: "rainy",       desc: "Rain" };
  if ([66, 67].includes(code))   return { icon: "snowy",         desc: "Freezing rain" };
  if ([71, 73, 75, 77].includes(code)) return { icon: "snowy",   desc: "Snow" };
  if ([80, 81, 82].includes(code)) return { icon: "rainy",       desc: "Rain showers" };
  if ([85, 86].includes(code))   return { icon: "snowy",         desc: "Snow showers" };
  if ([95, 96, 99].includes(code)) return { icon: "stormy",      desc: "Thunderstorm" };
  return { icon: "partly-cloudy", desc: "Unknown" };
}

// GET /api/weather?city=Tokyo
router.get("/", async (req, res) => {
  const city = (req.query.city || "").trim();
  if (!city) return res.status(400).json({ error: "city param required" });

  try {
    // ── Step 1: Geocode city name → lat/lon via Nominatim ────
    const geoUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1&addressdetails=1`;
    const geoRes = await fetch(geoUrl, {
      headers: { "User-Agent": "VoyagrTravelApp/1.0" },
    });
    const geoData = await geoRes.json();

    if (!geoData.length) {
      return res.status(404).json({ error: `City "${city}" not found` });
    }

    const place   = geoData[0];
    const lat     = parseFloat(place.lat);
    const lon     = parseFloat(place.lon);
    const addr    = place.address || {};
    const cityName = place.name || addr.city || addr.town || city;
    const country  = addr.country_code?.toUpperCase() || "";

    // ── Step 2: Fetch weather from Open-Meteo ────────────────
    const weatherUrl = [
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}`,
      `&current=temperature_2m,apparent_temperature,relative_humidity_2m`,
      `&current=wind_speed_10m,visibility,weather_code`,
      `&daily=weather_code,temperature_2m_max,temperature_2m_min`,
      `&wind_speed_unit=kmh&timezone=auto&forecast_days=7`,
    ].join("");

    const weatherRes  = await fetch(weatherUrl);
    const weatherData = await weatherRes.json();

    if (weatherData.error) {
      return res.status(500).json({ error: weatherData.reason || "Weather fetch failed" });
    }

    const cur = weatherData.current;
    const daily = weatherData.daily;
    const { icon: curIcon, desc: curDesc } = wmoToCondition(cur.weather_code);

    // ── Shape forecast ────────────────────────────────────────
    const todayStr = new Date().toISOString().slice(0, 10);
    const forecast = daily.time.map((dateStr, i) => {
      const { icon } = wmoToCondition(daily.weather_code[i]);
      const avgTemp  = Math.round((daily.temperature_2m_max[i] + daily.temperature_2m_min[i]) / 2);
      const dayIndex = new Date(dateStr).getDay();
      return {
        day:  dateStr === todayStr ? "Today" : DAYS[dayIndex],
        icon,
        temp: avgTemp,
      };
    });

    // ── Response (same shape as before) ──────────────────────
    res.json({
      city: country ? `${cityName}, ${country}` : cityName,
      current: {
        icon:       curIcon,
        desc:       curDesc,
        temp:       Math.round(cur.temperature_2m),
        feelsLike:  Math.round(cur.apparent_temperature),
        humidity:   cur.relative_humidity_2m,
        wind:       `${Math.round(cur.wind_speed_10m)} km/h`,
        visibility: cur.visibility != null
          ? `${(cur.visibility / 1000).toFixed(1)} km`
          : "N/A",
      },
      forecast,
    });

  } catch (err) {
    console.error("Weather error:", err.message);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

module.exports = router;