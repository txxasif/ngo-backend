const asyncHandler = require("express-async-handler");
const Branch = require("../../model/BranchSchema");

const addBranchController = asyncHandler(async (req, res) => {
  const branchBody = req.body;
  const { hostBranch, branchCode, branchName, address } = branchBody;
  if (!hostBranch || !branchCode || !branchName || !address) {
    return res.json({ message: "All Fields Are Required" }).status(400);
  }
  // Check if a branch with the same branchCode already exists (case-sensitive)
  const existingBranchWithCode = await Branch.findOne({
    branchCode: { $regex: new RegExp(`^${branchCode}$`, "i") },
  });
  if (existingBranchWithCode) {
    return res
      .status(400)
      .json({ message: "Branch with the same branchCode already exists" });
  }

  // Check if a branch with the same branchName already exists (case-sensitive)
  const existingBranchWithName = await Branch.findOne({
    branchName: { $regex: new RegExp(`^${branchName}$`, "i") },
  });
  if (existingBranchWithName) {
    return res
      .status(400)
      .json({ message: "Branch with the same branchName already exists" });
  }
  const newBranch = await Branch.create(branchBody);
  if (!newBranch) {
    return res.json({ message: "Something Went Wrong" }).status(404);
  }
  return res.json({ message: "Branch Created Successfully", branchBody });
});
const getAllBranchController = asyncHandler(async (req, res) => {
  const allBranch = await Branch.find({});
  res.json({ data: allBranch });
});
module.exports = {
  addBranchController,
  getAllBranchController,
};
