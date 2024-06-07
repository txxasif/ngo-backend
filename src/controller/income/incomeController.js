const asyncHandler = require("express-async-handler");
const IncomeHead = require("../../model/IncomeSchema");
const IncomeHeadTransaction = require("../../model/IncomeHeadTransactionSchema");



const createIncomeHeadController = asyncHandler(async (req, res) => {
    const incomeHeadBody = req.body;
    console.log(incomeHeadBody);
    const newIncomeHead = await IncomeHead.create(incomeHeadBody);
    if (!newIncomeHead) {
        return res.status(404).json({ message: "Something Went Wrong" });
    }
    return res
        .status(200)
        .json({ message: "Income Head created successfully" });
});
const getAllIncomeHeadController = asyncHandler(async (req, res) => {
    const allIncomeHead = await IncomeHead.find({});
    return res.status(200).json({ data: allIncomeHead });
});
// create income head transaction
const createIncomeHeadTransactionController = asyncHandler(async (req, res) => {
    const incomeHeadTransactionBody = req.body;
    console.log(incomeHeadTransactionBody);
    const newIncomeHeadTransaction = await IncomeHeadTransaction.create(incomeHeadTransactionBody);
    if (!newIncomeHeadTransaction) {
        return res.status(404).json({ message: "Something Went Wrong" });
    }
    return res
        .status(200)
        .json({ message: "Income Head Transaction created successfully" });
})
module.exports = {
    createIncomeHeadController,
    getAllIncomeHeadController,
    createIncomeHeadTransactionController
};
