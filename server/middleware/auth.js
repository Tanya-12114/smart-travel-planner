// server/middleware/auth.js
// Verifies JWT from httpOnly cookie on every protected request

const jwt  = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "voyagr_dev_secret_change_in_production";

module.exports = async function authMiddleware(req, res, next) {
  try {
    // Read token from httpOnly cookie (set at login)
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ error: "Not authenticated — please log in" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user    = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user; // attach to request for use in route handlers
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired session — please log in again" });
  }
};