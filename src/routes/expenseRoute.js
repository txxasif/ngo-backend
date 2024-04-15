const express = require("express");
const {
  createMonthlyExpenseController,
  createPurchaseExpenseController,
} = require("../controller/expense/expenseController");

const expenseRoute = express.Router();

expenseRoute.post("/monthly/add", createMonthlyExpenseController);
expenseRoute.post("/purchase/add", createPurchaseExpenseController);

module.exports = expenseRoute;
