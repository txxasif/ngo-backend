const express = require("express");
const {
  createAssetHeaderController, getAssetHeadListController, createAssetController
} = require("../controller/asset/assetController");
const assetRoute = express.Router();
assetRoute.post("/add", createAssetController);
assetRoute.post("/head/add", createAssetHeaderController);
assetRoute.get("/head/all", getAssetHeadListController);

module.exports = assetRoute;
