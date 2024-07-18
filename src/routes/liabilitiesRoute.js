const express = require("express");
const { createExpenseLiabilityController, createAssetLiabilityController } = require("../controller/liabilities/liabilitiesController");
const liabilitiesRoute = express.Router();

liabilitiesRoute.post("/expense/create", createExpenseLiabilityController);
liabilitiesRoute.post("/asset/create", createAssetLiabilityController);
module.exports = liabilitiesRoute;
