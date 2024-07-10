const express = require("express");
const { balanceSheetController, incomeVsExpenseController } = require("../controller/report/reportController");
const reportRoute = express.Router();

reportRoute.get("/balance_sheet", balanceSheetController);
reportRoute.get("/income_vs_expense", incomeVsExpenseController)
module.exports = reportRoute;
