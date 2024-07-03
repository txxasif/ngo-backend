const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema(
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
    headId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AssetHead",
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
    appreciation: {
      type: Number,
      default: 0,
    },
    depreciation: {
      type: Number,
      default: 0,
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

    total: {
      type: Number,
      default: 0,
    },
    remarks: {
      type: String,
    },
  },
  { timestamps: true }
);

const Asset =
  mongoose.models.Asset || mongoose.model("Asset", assetSchema);
module.exports = Asset;
