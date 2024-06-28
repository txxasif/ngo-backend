const express = require("express");
const {
  createMonthlyExpenseController,
  createPurchaseExpenseController,
  getExpenseList, createExpenseHeaderController, getExpenseHeadListController
} = require("../controller/expense/expenseController");

const expenseRoute = express.Router();

expenseRoute.post("/monthly/add", createMonthlyExpenseController);
expenseRoute.post("/head/add", createExpenseHeaderController);
expenseRoute.get("/head/all", getExpenseHeadListController);
expenseRoute.post("/purchase/add", createPurchaseExpenseController);
expenseRoute.get("/all", getExpenseList);


module.exports = expenseRoute;
