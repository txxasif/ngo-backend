const mongoose = require("mongoose");

const drawerCashSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
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
    date: {
      type: Date,
      required: true,
    },
    sourceDetails: {
      type: String,
      required: true,
    },
    remarks: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["cashIn", "cashOut"],
    },
  },
  { timestamps: true }
);

const DrawerCash =
  mongoose.models.DrawerCash || mongoose.model("DrawerCash", drawerCashSchema);

module.exports = DrawerCash;
