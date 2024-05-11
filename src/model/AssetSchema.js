const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema(
  {
    branchId: {
      type: String,
      required: true,
    },
    samityId: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["fixed", "temporary"],
    },
    productName: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    unitPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    depreciationPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    amount: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
    },

    depreciation: { type: Number, default: 0 },
    description: {
      type: String,
      required: true,
    },
    remarks: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Asset = mongoose.models.Asset || mongoose.model("Asset", assetSchema);

module.exports = Asset;
