// server/routes/trips.js
const express = require("express");
const router  = express.Router();
const Trip    = require("../models/Trip");
const auth    = require("../middleware/auth");

// All trip routes require authentication
router.use(auth);

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

// GET all trips — only for logged-in user
router.get("/", async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.user._id }).sort({ updatedAt: -1 });

    const enriched = await Promise.all(
      trips.map(async (trip) => {
        if (trip.lat != null && trip.lng != null) return trip.toObject();
        const coords = await geocodeDestination(trip.destination || trip.title);
        if (coords) {
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

// GET single trip — must belong to user
router.get("/:id", async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user._id });
    if (!trip) return res.status(404).json({ error: "Trip not found" });
    res.json(trip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create trip — attach userId
router.post("/", async (req, res) => {
  try {
    const { title, destination, days, lat, lng } = req.body;

    let coords = { lat: lat ?? null, lng: lng ?? null };
    if (coords.lat == null && destination) {
      const geocoded = await geocodeDestination(destination);
      if (geocoded) coords = geocoded;
    }

    const trip = await Trip.create({
      userId: req.user._id,
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

// PUT update trip — must belong to user
router.put("/:id", async (req, res) => {
  try {
    const trip = await Trip.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    if (!trip) return res.status(404).json({ error: "Trip not found" });
    res.json(trip);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE trip — must belong to user
router.delete("/:id", async (req, res) => {
  try {
    const trip = await Trip.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!trip) return res.status(404).json({ error: "Trip not found" });
    res.json({ message: "Trip deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;