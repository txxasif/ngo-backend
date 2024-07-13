const asyncHandler = require("express-async-handler");
const { getDrawerCashHelper, bankCashHelper } = require("../../helper/reportHepler");
const { generateBalanceSheet } = require("../../helper/balanceSheetHelper");
const incomeVsExpenseHelper = require("../../helper/incomeVsExpenseHelper");
const generateTrialBalanceSheet = require("../../helper/generateTrialBalanceSheet");
const trialBalanceController = asyncHandler(async (req, res) => {
    const { from, to } = req.query;
    const result = await generateTrialBalanceSheet(from, to);

    res.json({ data: result });
});

const balanceSheetController = asyncHandler(async (req, res) => {
    const { from, to } = req.query;
    const result = await generateBalanceSheet(from, to);
    res.json({ data: result });
});
const incomeVsExpenseController = asyncHandler(async (req, res) => {
    const { from, to } = req.query;
    const result = await incomeVsExpenseHelper(from, to);
    res.json({ data: result });
})
module.exports = {
    balanceSheetController,
    trialBalanceController,
    incomeVsExpenseController
}