const asyncHandler = require("express-async-handler");
const IncomeHead = require("../../model/IncomeSchema");
const IncomeHeadTransaction = require("../../model/IncomeHeadTransactionSchema");
const { LoanTransaction } = require("../../model/LoanAccountSchema");
const LocalUser = require("../../model/LocalUserSchema");
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
});
const incomeDayWiseController = asyncHandler(async (req, res) => {
    const { date } = req.query;
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0 for the start of the day
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999); // Set hours, minutes, seconds, and milliseconds to the end of the day

    const incomeHeadTransaction = await IncomeHeadTransaction.aggregate([
        { $match: { date: { $gte: startDate, $lt: endDate } } },
        {
            $lookup: {
                from: "incomeheads",
                localField: "headId",
                foreignField: "_id",
                as: "incomeHead",
            }
        },
        {
            $unwind: "$incomeHead"
        },
        {
            $group: {
                _id: "$incomeHead.head",
                total: { $sum: "$amount" }
            }
        }

    ])
    const loanProfit = await LoanTransaction.aggregate([
        { $match: { createdAt: { $gte: startDate, $lt: endDate } } },
        {
            $group: {
                _id: 'Loan Profit',
                total: { $sum: "$profit" }
            }
        }
    ])

    const memberProfit = await LocalUser.aggregate([
        { $match: { openingDate: { $gte: startDate, $lt: endDate } } },
        {
            $group: {
                _id: 'Member Profit',
                total: { $sum: { $add: ["$membershipFee", "$formFee"] } }

            }
        }
    ])
    console.log(loanProfit[0]);
    console.log(incomeHeadTransaction[0]);
    console.log(memberProfit[0]);
    return res.status(200).json({ data: incomeHeadTransaction });
})
module.exports = {
    createIncomeHeadController,
    getAllIncomeHeadController,
    createIncomeHeadTransactionController,
    incomeDayWiseController
};
