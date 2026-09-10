// server/index.js
require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");
const app      = require("./app");

const PORT = process.env.PORT || 5000;

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
