const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema(
  {
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
    expenseName: {
      type: String,
    },
    description: {
      type: String,
    },
    unitAmount: {
      type: Number,
    },
    unitPrice: {
      type: Number,
    },
    tds: {
      type: Number,
    },
    tax: {
      type: Number,
    },
    date: {
      type: Date,
      required: true,
    },
    vat: {
      type: Number,
    },
    totalPayment: {
      type: Number,
    },
    total: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["paid", "unpaid"],
      required: true,
    },
    remarks: {
      type: String,
    },
  },
  { timestamps: true }
);

const Purchase =
  mongoose.models.Purchase || mongoose.model("Purchase", purchaseSchema);
module.exports = Purchase;
