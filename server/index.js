// server/index.js
require("dotenv").config({ path: ".env.local" });
const express    = require("express");
const cors       = require("cors");
const mongoose   = require("mongoose");
const cookieParser = require("cookie-parser");

const authRoutes    = require("./routes/auth");
const tripRoutes    = require("./routes/trips");
const expenseRoutes = require("./routes/expenses");
const weatherRoutes = require("./routes/weather");

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──────────────────────────────────────────
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser()); // needed to read req.cookies

// ── Routes ──────────────────────────────────────────────
app.use("/api/auth",     authRoutes);     // public
app.use("/api/trips",    tripRoutes);     // protected
app.use("/api/expenses", expenseRoutes);  // protected (via trips)
app.use("/api/weather",  weatherRoutes);  // public

app.get("/api/health", (_, res) => res.json({ status: "ok", time: new Date() }));

// ── MongoDB ─────────────────────────────────────────────
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
    app.listen(PORT, () =>
      console.log(`🚀  Server running without DB on http://localhost:${PORT}`)
    );
  });

module.exports = app;