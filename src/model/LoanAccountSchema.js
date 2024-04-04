const mongoose = require("mongoose");
// Transaction Schema
const transactionSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

const loanAccountSchema = new mongoose.Schema(
  {
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LocalUser",
      required: true,
    },
    paymentTerm: {
      type: String,
      enum: [
        "Daily",
        "Weekly",
        "Fortnightly",
        "Monthly",
        "Quarterly",
        "Half-Yearly",
        "Yearly",
      ],
      required: true,
    },
    loanAmount: {
      type: Number,
      required: true,
    },
    profitPercentage: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    numberOfInstallment: {
      type: Number,
      required: true,
    },
    installmentAmount: {
      type: Number,
      required: true,
    },
    openingDate: {
      type: Date,
      required: true,
    },
    periodOfTimeInMonths: {
      type: Number,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },

    transactions: [transactionSchema],
    paid: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const LoanAccount =
  mongoose.models.LoanAccount ||
  mongoose.model("LoanAccount", loanAccountSchema);
const Transaction =
  mongoose.models.Transaction ||
  mongoose.model("Transaction", transactionSchema);

module.exports = { LoanAccount, Transaction };
