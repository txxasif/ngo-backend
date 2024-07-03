const express = require("express");
const {
  createMonthlyExpenseController,
  getExpenseList, createExpenseHeaderController, getExpenseHeadListController
} = require("../controller/expense/expenseController");

const expenseRoute = express.Router();

expenseRoute.post("/monthly/add", createMonthlyExpenseController);
expenseRoute.post("/head/add", createExpenseHeaderController);
expenseRoute.get("/head/all", getExpenseHeadListController);
expenseRoute.get("/all", getExpenseList);


module.exports = expenseRoute;
