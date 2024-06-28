const mongoose = require("mongoose");
const transactionSchema = new mongoose.Schema({
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
}, {
  timestamps: true,
});
const withdrawSchema = new mongoose.Schema({
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


}, {
  timestamps: true,
});
const savingsAccountSchema = new mongoose.Schema({
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
  profitPercentage: {
    type: Number,
    required: true,
  },
  openingDate: {
    type: Date,
    required: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
  totalDeposit: {
    type: Number,
    default: 0,
  },
  totalWithdraw: {
    type: Number,
    default: 0,
  },
  closingRequest: {
    type: Boolean,
    default: false,
  },
  profit: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'closed']
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

}, {
  timestamps: true,
});

const SavingsAccount =
  mongoose.models.SavingsAccount ||
  mongoose.model("SavingsAccount", savingsAccountSchema);
const SavingsAccountTransaction =
  mongoose.models.SavingsAccountTransaction ||
  mongoose.model("SavingsAccountTransaction", transactionSchema);
const SavingsAccountWithdraw =
  mongoose.models.SavingsAccountWithdraw || mongoose.model("SavingsAccountWithdraw", withdrawSchema);
module.exports = {
  SavingsAccount,
  SavingsAccountTransaction,
  SavingsAccountWithdraw
};