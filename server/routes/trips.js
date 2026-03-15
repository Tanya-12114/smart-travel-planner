// server/routes/trips.js
const express = require("express");
const router  = express.Router();
const Trip    = require("../models/Trip");

// GET all trips
router.get("/", async (req, res) => {
  try {
    const trips = await Trip.find().sort({ updatedAt: -1 });
    res.json(trips);
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

// POST create trip
router.post("/", async (req, res) => {
  try {
    const { title, destination, days } = req.body;
    const trip = await Trip.create({ title, destination, days: days || [] });
    res.status(201).json(trip);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update trip (title, destination, days)
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
