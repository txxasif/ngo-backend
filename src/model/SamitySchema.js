const mongoose = require("mongoose");
const samitySchema = new mongoose.Schema({
  samityName: {
    type: String,
    required: true,
  },
  drawerCash: {
    type: Number,
    default: 0,
  },
  bankCash: {
    type: Number,
    default: 0,
  },
  samityCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
  },
  address: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Active", "Deactive"],
    default: "Active",
  },
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
    required: true,
  },
});
const Samity = mongoose.models.Samity || mongoose.model("Samity", samitySchema);
module.exports = Samity;
