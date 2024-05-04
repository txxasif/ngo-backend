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
  remark: {
    type: String,
  },
});

const ngoLoanSchema = new mongoose.Schema({
  institute: {
    type: String,
    required: true,
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
});
const NgoLoanTransaction =
  mongoose.models.NgoLoanTransaction ||
  mongoose.model("NgoLoanTransaction", ngoLoanTransactionSchema);

const NgoLoan =
  mongoose.models.NgoLoan || mongoose.model("NgoLoan", ngoLoanSchema);

module.exports = { NgoLoan, NgoLoanTransaction };
