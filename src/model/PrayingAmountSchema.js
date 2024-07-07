const mongoose = require("mongoose");
const prayingAmountSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
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

  reason: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  adjustmentDuration: { type: Number, required: true },
  adjustmentAmount: { type: Number, required: true },
  date: { type: Date, required: true },
  isPaid: { type: Boolean, default: false },
});

const PrayingAmount =
  mongoose.models.PrayingAmount ||
  mongoose.model("PrayingAmount", prayingAmountSchema);
module.exports = PrayingAmount;
