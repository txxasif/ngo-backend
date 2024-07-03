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
    headId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExpenseHead",
      required: true,
    },
    by: {
      name: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        required: true,
      },
    },
    date: {
      type: Date,
      required: true,
    },

    amount: {
      type: Number,
      default: 0,
      required: true,
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
