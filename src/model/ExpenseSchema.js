const mongoose = require("mongoose");
const expenseSchema = new mongoose.Schema(
  {
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },
    samityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Samity",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    officeRent: {
      type: Number,
      required: true,
    },
    salary: {
      type: Number,
      required: true,
    },
    stationaryAndPrinting: {
      type: Number,
      required: true,
    },
    taDaAllowances: {
      type: Number,
      required: true,
    },
    anyBill: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      default: 0,
    },
    remarks: {
      type: String,
    },
  },
  { timestamps: true }
);

const Expense =
  mongoose.models.Expense || mongoose.model("Expense", expenseSchema);
module.exports = Expense;
