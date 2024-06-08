const express = require("express");
const { createIncomeHeadController, getAllIncomeHeadController, incomeDayWiseController, createIncomeHeadTransactionController } = require("../controller/income/incomeController");
const incomeRoute = express.Router();

incomeRoute.post("/create/transaction", createIncomeHeadTransactionController);
incomeRoute.post("/create", createIncomeHeadController);
incomeRoute.get("/all", getAllIncomeHeadController);
incomeRoute.get("/day-wise", incomeDayWiseController);


module.exports = incomeRoute;