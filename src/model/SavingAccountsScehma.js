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
const savingsAccountSchema = new mongoose.Schema(
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
    balanceWithProfit: {
      type: Number,
      default: 0,
    },
    closingRequest: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'closed']
    },
    openedBy: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,

        refPath: 'openedByRef'
      },
      role: {
        type: String,
        enum: ['admin', 'collector'],
      }
    },
    openedByRef: {
      _id: {
        type: String,
        enum: ['admin', 'collector'],
      }
    }

  },
  {
    timestamps: true,
  }
);

const SavingsAccount =
  mongoose.models.SavingsAccount ||
  mongoose.model("SavingsAccount", savingsAccountSchema);

module.exports = { SavingsAccount };
