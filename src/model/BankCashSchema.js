const mongoose = require("mongoose");

const bankCashSchema = new mongoose.Schema(
  {
    branchId: {
      type: String,
      required: true,
    },
    samityId: {
      type: String,
      required: true,
    },
    bankId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["cashIn", "cashOut"],
      default: "cashIn",
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const BankCash =
  mongoose.models.BankCash || mongoose.model("BankCash", bankCashSchema);

module.exports = BankCash;
