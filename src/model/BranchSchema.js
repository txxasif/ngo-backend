const mongoose = require("mongoose");
const branchSchema = new mongoose.Schema({
  hostBranch: {
    type: Boolean,
    enum: [true, false],
  },
  branchCode: {
    type: String,
    required: true,
    unique: true,
    upperCase: true,
  },
  branchName: {
    type: String,
    required: true,
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
});
const Branch = mongoose.models.Branch || mongoose.model("Branch", branchSchema);
module.exports = Branch;
