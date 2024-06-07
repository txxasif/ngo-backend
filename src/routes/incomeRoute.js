const express = require("express");
const { createIncomeHeadController, getAllIncomeHeadController, createIncomeHeadTransactionController } = require("../controller/income/incomeController");
const incomeRoute = express.Router();

incomeRoute.post("/create/transaction", createIncomeHeadTransactionController);
incomeRoute.post("/create", createIncomeHeadController);
incomeRoute.get("/all", getAllIncomeHeadController);

module.exports = incomeRoute;