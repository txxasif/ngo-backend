const express = require("express");
const {
  addBranchController,
  getAllBranchController,
} = require("../controller/branch/branchController");
const branchRoute = express.Router();

branchRoute.post("/add", addBranchController);
branchRoute.get("/all", getAllBranchController);

module.exports = branchRoute;
