const express = require("express");
const {
  addSamityController,
  getAllSamityControllerByBranchId,
} = require("../controller/samity/samityController");

const samityRoute = express.Router();

samityRoute.post("/add", addSamityController);
samityRoute.get("/all/:branchId", getAllSamityControllerByBranchId);

module.exports = samityRoute;
