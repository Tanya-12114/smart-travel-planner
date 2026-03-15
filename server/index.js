// server/index.js — Express + MongoDB Backend

require("dotenv").config({ path: ".env.local" });
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const tripRoutes    = require("./routes/trips");
const expenseRoutes = require("./routes/expenses");
const weatherRoutes      = require("./routes/weather");

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──────────────────────────────────────────
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

// ── Routes ──────────────────────────────────────────────
app.use("/api/trips",    tripRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/weather",      weatherRoutes);

// Health check
app.get("/api/health", (_, res) => res.json({ status: "ok", time: new Date() }));

// ── MongoDB Connection ──────────────────────────────────
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/voyagr")
  .then(() => {
    console.log("✅  MongoDB connected");
    app.listen(PORT, () =>
      console.log(`🚀  Express server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌  MongoDB connection error:", err.message);
    console.log("⚠️   Starting server without DB (data won't persist)");
    app.listen(PORT, () =>
      console.log(`🚀  Express server running on http://localhost:${PORT}`)
    );
  });

module.exports = app;