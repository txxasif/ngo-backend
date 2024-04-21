const express = require("express");
const {
  makeMonthlyPaySlipController,
} = require("../controller/paySlip/paySlipController");

const paySlipRoute = express.Router();

paySlipRoute.post("/monthly/create", makeMonthlyPaySlipController);

module.exports = paySlipRoute;
