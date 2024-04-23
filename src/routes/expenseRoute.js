const express = require("express");
const {
  createMonthlyExpenseController,
  createPurchaseExpenseController,
  getExpenseList,
} = require("../controller/expense/expenseController");

const expenseRoute = express.Router();

expenseRoute.post("/monthly/add", createMonthlyExpenseController);
expenseRoute.post("/purchase/add", createPurchaseExpenseController);
expenseRoute.get("/all", getExpenseList);

module.exports = expenseRoute;
