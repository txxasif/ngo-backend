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
const withdrawSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});
const depositAccountSchema = new mongoose.Schema(
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
    periodOfTimeInMonths: {
      type: Number,
      required: true,
    },
    perInstallment: {
      type: Number,
      required: true,
    },
    profitPercentage: {
      type: Number,
      required: true,
    },
    onMatureAmount: {
      type: Number,
      required: true,
    },
    openingDate: {
      type: Date,
      required: true,
    },
    matureDate: {
      type: Date,
      required: true,
    },
    // firstDueDate: {
    //   type: Date,
    //   required: true,
    // },
    transactions: [transactionSchema],
    withdraws: [withdrawSchema],
    balance: {
      type: Number,
    },
    isOpen: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

const DepositAccount =
  mongoose.models.DepositAccount ||
  mongoose.model("DepositAccount", depositAccountSchema);

module.exports = DepositAccount;
