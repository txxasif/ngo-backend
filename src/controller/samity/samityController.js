const asyncHandler = require("express-async-handler");
const Samity = require("../../model/SamitySchema");
const Branch = require("../../model/BranchSchema");
const addSamityController = asyncHandler(async (req, res) => {
  const samityBody = req.body;
  const { samityName, samityCode, branchId, address } = samityBody;
  if (!samityCode || !samityName || !address || !branchId) {
    return res.json({ message: "All Fields Are Required" }).status(400);
  }
  try {
    const checkBranch = await Branch.findOne({ _id: branchId });
  } catch (error) {
    return res.json({ message: "No Branch Found" }).status(404);
  }
  // Check if a branch with the same branchCode already exists (case-sensitive)
  const existingSamityWithCode = await Samity.findOne({
    samityCode: { $regex: new RegExp(`^${samityCode}$`, "i") },
  });
  if (existingSamityWithCode) {
    return res
      .status(400)
      .json({ message: "Samity with the same Samity Code already exists" });
  }

  // Check if a branch with the same branchName already exists (case-sensitive)
  const existingSamityWithName = await Samity.findOne({
    samityName: { $regex: new RegExp(`^${samityName}$`, "i") },
  });
  if (existingSamityWithName) {
    return res
      .status(400)
      .json({ message: "Samity with the same Samity Name already exists" });
  }
  const newBranch = await Samity.create(samityBody);
  if (!newBranch) {
    return res.json({ message: "Something Went Wrong" }).status(404);
  }
  return res.json({ message: "Samity Created Successfully", samityBody });
});
const getAllSamityControllerByBranchId = asyncHandler(async (req, res) => {
  const branchId = req.params.branchId;
  console.log(branchId);
  const allBranch = await Samity.find({ branchId: branchId });
  res.json({ data: allBranch });
});

module.exports = {
  addSamityController,
  getAllSamityControllerByBranchId,
};
