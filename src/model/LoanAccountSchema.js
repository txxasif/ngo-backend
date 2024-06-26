const mongoose = require("mongoose");
// Transaction Schema
const transactionSchema = new mongoose.Schema(
  {
    loanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LoanAccount",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    addFineAmount: {
      type: Number,
      default: 0,
    },
    fineReason: {
      type: String,
      default: null,
    },
    payFineAmount: {
      type: Number,
      default: 0,
    },
    profit: {
      type: Number,
      default: 0,
    },
    date: {
      type: Date
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
  },
  {
    timestamps: true,
  }
);

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
    loanFine: {
      type: Number,
      default: 0,
    },
    loanFinePaid: {
      type: Number,
      default: 0,
    },
    closingRequest: {
      type: Boolean,
      default: false,
    },
    openedBy: {
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
    status: {
      type: String,
      enum: ['pending', 'approved', 'closed']
    },
    paid: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const LoanAccount =
  mongoose.models.LoanAccount ||
  mongoose.model("LoanAccount", loanAccountSchema);
const LoanTransaction =
  mongoose.models.LoanTransaction ||
  mongoose.model("LoanTransaction", transactionSchema);

module.exports = { LoanAccount, LoanTransaction };
