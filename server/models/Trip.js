// server/models/Trip.js
const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  name:  { type: String, required: true },
  emoji: { type: String, default: "📌" },
});

const DaySchema = new mongoose.Schema({
  date:   { type: String, default: "" },
  events: { type: [EventSchema], default: [] },
});

const TripSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true },
    destination: { type: String, default: "" },
    days:        { type: [DaySchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Trip || mongoose.model("Trip", TripSchema);
