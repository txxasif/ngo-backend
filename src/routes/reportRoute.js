const express = require("express");
const { balanceSheetController, incomeVsExpenseController, trialBalanceController } = require("../controller/report/reportController");
const reportRoute = express.Router();


reportRoute.get("/balance_sheet", balanceSheetController);
reportRoute.get("/income_vs_expense", incomeVsExpenseController);
reportRoute.get("/trial_balance", trialBalanceController);
module.exports = reportRoute;
