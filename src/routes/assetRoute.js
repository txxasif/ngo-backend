const express = require("express");
const { addAssetController } = require("../controller/asset/assetController");
const assetRoute = express.Router();

assetRoute.post("/add", addAssetController);

module.exports = assetRoute;
