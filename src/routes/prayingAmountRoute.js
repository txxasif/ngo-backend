const express = require("express");
const {
  createPrayingAmountApplicationController,
} = require("../controller/prayingAmout/prayingAmountController");
const prayingAmountRoute = express.Router();

prayingAmountRoute.post("/create", createPrayingAmountApplicationController);

module.exports = prayingAmountRoute;
