// server/routes/trips.js
const express = require("express");
const router  = express.Router();
const Trip    = require("../models/Trip");

// Server-side geocode via Nominatim (no CORS issue here)
async function geocodeDestination(destination) {
  if (!destination) return null;
  try {
    const url  = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(destination)}&format=json&limit=1`;
    const res  = await fetch(url, { headers: { "User-Agent": "VoyagrTravelApp/1.0" } });
    const data = await res.json();
    if (!data.length) return null;
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  } catch {
    return null;
  }
}

// GET all trips — auto-geocode any missing coordinates
router.get("/", async (req, res) => {
  try {
    const trips = await Trip.find().sort({ updatedAt: -1 });

    // Enrich trips missing coords — geocode + persist so next load is instant
    const enriched = await Promise.all(
      trips.map(async (trip) => {
        if (trip.lat != null && trip.lng != null) return trip.toObject();
        const coords = await geocodeDestination(trip.destination || trip.title);
        if (coords) {
          // Persist coords so we only geocode once
          await Trip.findByIdAndUpdate(trip._id, coords);
          return { ...trip.toObject(), ...coords };
        }
        return trip.toObject();
      })
    );

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single trip
router.get("/:id", async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ error: "Trip not found" });
    res.json(trip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create trip — geocode if coords not provided
router.post("/", async (req, res) => {
  try {
    const { title, destination, days, lat, lng } = req.body;

    let coords = { lat: lat ?? null, lng: lng ?? null };

    // If no coords sent, geocode on the server right now
    if (coords.lat == null && destination) {
      const geocoded = await geocodeDestination(destination);
      if (geocoded) coords = geocoded;
    }

    const trip = await Trip.create({
      title,
      destination,
      days: days || [],
      lat:  coords.lat,
      lng:  coords.lng,
    });

    res.status(201).json(trip);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update trip
router.put("/:id", async (req, res) => {
  try {
    const trip = await Trip.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    if (!trip) return res.status(404).json({ error: "Trip not found" });
    res.json(trip);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE trip
router.delete("/:id", async (req, res) => {
  try {
    await Trip.findByIdAndDelete(req.params.id);
    res.json({ message: "Trip deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;