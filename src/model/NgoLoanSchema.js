const mongoose = require("mongoose");

const ngoLoanTransactionSchema = new mongoose.Schema({
  ngoLoanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "NgoLoan",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  paidDate: {
    type: Date,
    default: Date.now,
  },
  expense: {
    type: Number,
    default: 0
  },
  by: {
    name: {
      type: String,
    },
    phone: {
      type: String,
    },
    type: {
      type: String,
    },
  },

  status: {
    type: String,
    enum: ["unpaid", "paid"],
  }
}, {
  timestamps: true
});

const ngoLoanSchema = new mongoose.Schema(
  {
    institute: {
      type: String,
      required: true,
      enum: ["organization", "bank", "another"],
    },

    nameOfInstitute: {
      type: String,
      required: true,
    },
    durationInMonth: {
      type: Number,
      required: true,
    },
    interestRate: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    perInstallment: {
      type: Number,
      required: true,
    },
    remark: {
      type: String,
    },
    totalPaid: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);
const NgoLoanTransaction =
  mongoose.models.NgoLoanTransaction ||
  mongoose.model("NgoLoanTransaction", ngoLoanTransactionSchema);

const NgoLoan =
  mongoose.models.NgoLoan || mongoose.model("NgoLoan", ngoLoanSchema);

module.exports = { NgoLoan, NgoLoanTransaction };
