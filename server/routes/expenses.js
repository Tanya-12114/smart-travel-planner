// server/routes/expenses.js
const express = require("express");
const router  = express.Router();
const Expense = require("../models/Expense");

// GET all expenses for a trip
router.get("/trip/:tripId", async (req, res) => {
  try {
    const expenses = await Expense.find({ tripId: req.params.tripId }).sort({ createdAt: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET budget total for a trip
router.get("/trip/:tripId/summary", async (req, res) => {
  try {
    const expenses = await Expense.find({ tripId: req.params.tripId });
    const spent = expenses.reduce((sum, e) => sum + e.amount, 0);
    const budget = expenses.length > 0 ? expenses[0].budget : 0;
    res.json({ spent, budget, remaining: budget - spent, count: expenses.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create expense
router.post("/", async (req, res) => {
  try {
    const { tripId, label, amount, category, budget } = req.body;
    const expense = await Expense.create({ tripId, label, amount, category, budget });
    res.status(201).json(expense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update budget for all trip expenses
router.put("/trip/:tripId/budget", async (req, res) => {
  try {
    const { budget } = req.body;
    await Expense.updateMany({ tripId: req.params.tripId }, { budget });
    res.json({ message: "Budget updated", budget });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE expense
router.delete("/:id", async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Expense deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
