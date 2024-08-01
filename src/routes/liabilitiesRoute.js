const express = require("express");
const { createExpenseLiabilityController, createAssetLiabilityController, getAssetLiabilityListController, getExpenseLiabilityListController } = require("../controller/liabilities/liabilitiesController");
const liabilitiesRoute = express.Router();

liabilitiesRoute.post("/expense/create", createExpenseLiabilityController);
liabilitiesRoute.get("/expense/list", getExpenseLiabilityListController);
liabilitiesRoute.post("/asset/create", createAssetLiabilityController);
liabilitiesRoute.get("/asset/list", getAssetLiabilityListController);

module.exports = liabilitiesRoute;
