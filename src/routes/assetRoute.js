const express = require("express");
const {
  addAssetController,
  getAllAssetsController,
} = require("../controller/asset/assetController");
const assetRoute = express.Router();

assetRoute.post("/add", addAssetController);
assetRoute.get("/all", getAllAssetsController);

module.exports = assetRoute;
