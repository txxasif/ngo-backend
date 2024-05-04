const mongoose = require("mongoose");

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
});

const NgoLoan = mongoose.model("NgoLoan", ngoLoanSchema);

module.exports = NgoLoan;
