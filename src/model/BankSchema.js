const mongoose = require("mongoose");
const bankSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const Bank = mongoose.models.Bank || mongoose.model("Bank", bankSchema);
module.exports = Bank;
