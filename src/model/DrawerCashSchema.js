const mongoose = require("mongoose");

const drawerCashSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    isCapital: {
      type: Boolean,
      default: false,
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
    transactionDetails: {
      date: {
        type: Date,
        required: true,
      },
      sourceDetails: {
        type: String,
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
    },
    type: {
      type: String,
      enum: ["cashIn", "cashOut"],
      default: "cashIn",
    },
  },
  { timestamps: true }
);

const DrawerCash =
  mongoose.models.DrawerCash || mongoose.model("DrawerCash", drawerCashSchema);

module.exports = DrawerCash;
