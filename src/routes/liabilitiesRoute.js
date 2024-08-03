const express = require("express");
const { payExpenseLiabilityController, createExpenseLiabilityController, createAssetLiabilityController, getAssetLiabilityListController, getExpenseLiabilityListController, payAssetLiabilityController } = require("../controller/liabilities/liabilitiesController");
const liabilitiesRoute = express.Router();

liabilitiesRoute.post("/expense/create", createExpenseLiabilityController);
liabilitiesRoute.get("/expense/pay/:id", payExpenseLiabilityController);
liabilitiesRoute.get("/expense/list", getExpenseLiabilityListController);
liabilitiesRoute.post("/asset/create", createAssetLiabilityController);
liabilitiesRoute.get("/asset/list", getAssetLiabilityListController);
liabilitiesRoute.get("/asset/pay/:id", payAssetLiabilityController);
module.exports = liabilitiesRoute;
