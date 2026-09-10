// server/app.js
// Express app configuration only — no MongoDB connection, no app.listen().
// This split exists so tests (and anything else) can import the app
// without triggering a real DB connection or binding a real port.
const express      = require("express");
const cors         = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes    = require("./routes/auth");
const tripRoutes    = require("./routes/trips");
const expenseRoutes = require("./routes/expenses");
const weatherRoutes = require("./routes/weather");

const app = express();

// ── Middleware ──────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// ── Routes ──────────────────────────────────────────────
app.use("/api/auth",     authRoutes);     // public
app.use("/api/trips",    tripRoutes);     // protected
app.use("/api/expenses", expenseRoutes);  // protected (via trips)
app.use("/api/weather",  weatherRoutes);  // public

app.get("/api/health", (_, res) => res.json({ status: "ok", time: new Date() }));

module.exports = app;
