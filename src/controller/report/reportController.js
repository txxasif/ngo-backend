const asyncHandler = require("express-async-handler");
const { getDrawerCashHelper, bankCashHelper } = require("../../helper/reportHepler");
const { generateBalanceSheet } = require("../../helper/balanceSheetHelper");
const incomeVsExpenseHelper = require("../../helper/incomeVsExpenseHelper");

const balanceSheetController = asyncHandler(async (req, res) => {
    const { from, to } = req.query;
    const result = await generateBalanceSheet()
    res.json({ data: result });
});
const incomeVsExpenseController = asyncHandler(async (req, res) => {
    const { from, to } = req.query;
    const result = await incomeVsExpenseHelper(from, to);
    res.json({ data: result });
})
module.exports = {
    balanceSheetController,
    incomeVsExpenseController
}