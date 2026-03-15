// server/models/Expense.js
const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema(
  {
    tripId:   { type: mongoose.Schema.Types.ObjectId, ref: "Trip", required: true },
    label:    { type: String, required: true, trim: true },
    amount:   { type: Number, required: true, min: 0 },
    category: {
      type: String,
      enum: ["flights", "hotels", "food", "activities", "transport", "misc"],
      default: "misc",
    },
    budget:   { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Expense || mongoose.model("Expense", ExpenseSchema);
