const express = require("express");
const {
  getLiabilitiesDetailsController,
} = require("../controller/liabilities/liabilitiesController");
const liabilitiesRoute = express.Router();

liabilitiesRoute.get("/details", getLiabilitiesDetailsController);
module.exports = liabilitiesRoute;
