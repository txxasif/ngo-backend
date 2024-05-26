const mongoose = require("mongoose");
// Transaction Schema
const transactionSchema = new mongoose.Schema(
  {
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DepositAccount",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);
const withdrawSchema = new mongoose.Schema(
  {
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DepositAccount",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String
    }


  },
  {
    timestamps: true,
  }
);
const depositAccountSchema = new mongoose.Schema(
  {
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LocalUser",
      required: true,
    },
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
    transactions: [transactionSchema],
    withdraws: [withdrawSchema],
    balance: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'closed']
    }
  },
  {
    timestamps: true,
  }
);

const DepositAccount =
  mongoose.models.DepositAccount ||
  mongoose.model("DepositAccount", depositAccountSchema);
const Transaction =
  mongoose.models.Transaction ||
  mongoose.model("Transaction", transactionSchema);
const Withdraw =
  mongoose.models.Withdraw || mongoose.model("Withdraw", withdrawSchema);
module.exports = { DepositAccount, Withdraw, Transaction };
