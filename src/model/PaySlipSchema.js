const mongoose = require("mongoose");
const { type } = require("../schemaValidation/localUser");

const deductionSchema = new mongoose.Schema({});

const paySlipSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
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
    basicSalary: { type: String, required: true },
    mobileBill: { type: String, required: true },
    tourBill: { type: Number, default: 0 },
    overTime: { type: Number, default: 0 },
    specialAward: { type: Number, default: 0 },
    bonus: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    totalPaid: { type: Number, default: 0 },
    due: { type: Number, default: 0 },
    date: { type: Date },
    salaryMonthAndYear: { type: Date },
    deduction: {
      advance: { type: Number, default: 0 },
      ait: { type: Number, default: 0 },
      providentFund: { type: Number, default: 0 },
      absent: { type: Number, default: 0 },
      others: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

const PaySlip =
  mongoose.models.PaySlip || mongoose.model("PaySlip", paySlipSchema);

module.exports = PaySlip;
