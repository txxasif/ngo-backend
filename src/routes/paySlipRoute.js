const express = require("express");
const {
  makeMonthlyPaySlipController,
  getEmployeePaySlipByYearAndMonthController,
} = require("../controller/paySlip/paySlipController");

const paySlipRoute = express.Router();

paySlipRoute.post("/monthly/create", makeMonthlyPaySlipController);
paySlipRoute.get("/list", getEmployeePaySlipByYearAndMonthController);

module.exports = paySlipRoute;
