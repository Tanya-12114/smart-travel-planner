// server/routes/auth.js
const express = require("express");
const jwt     = require("jsonwebtoken");
const router  = express.Router();
const User    = require("../models/User");
const authMiddleware = require("../middleware/auth");

const JWT_SECRET  = process.env.JWT_SECRET  || "voyagr_dev_secret_change_in_production";
const COOKIE_OPTS = {
  httpOnly: true,           // JS cannot read — protects against XSS
  secure:   process.env.NODE_ENV === "production", // HTTPS only in prod
  // Frontend (Vercel) and backend (Render) live on different domains,
  // so the cookie needs sameSite:"none" in production to be sent cross-site.
  // "lax" still works for local dev where both run on localhost.
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge:   7 * 24 * 60 * 60 * 1000, // 7 days
};

function signToken(userId) {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "7d" });
}

// ── POST /api/auth/register ───────────────────────────────────
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ error: "Name, email and password are required" });

    if (password.length < 6)
      return res.status(400).json({ error: "Password must be at least 6 characters" });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(409).json({ error: "An account with this email already exists" });

    const user  = await User.create({ name, email, password });
    const token = signToken(user._id);

    res.cookie("token", token, COOKIE_OPTS);
    res.status(201).json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/auth/login ──────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ error: "No account found with this email" });

    const match = await user.matchPassword(password);
    if (!match)
      return res.status(401).json({ error: "Incorrect password" });

    const token = signToken(user._id);
    res.cookie("token", token, COOKIE_OPTS);
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/auth/logout ─────────────────────────────────────
router.post("/logout", (req, res) => {
  // clearCookie must be called with the SAME sameSite/secure/path
  // attributes used when the cookie was originally set, or the browser
  // won't recognise it as the same cookie and will silently keep it.
  res.clearCookie("token", {
    httpOnly: COOKIE_OPTS.httpOnly,
    secure:   COOKIE_OPTS.secure,
    sameSite: COOKIE_OPTS.sameSite,
  });
  res.json({ message: "Logged out" });
});

// ── GET /api/auth/me — check current session ─────────────────
router.get("/me", authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;