const asyncHandler = require("express-async-handler");
const { SavingsAccount, SavingsAccountTransaction, SavingsAccountWithdraw } = require("../../model/SavingAccountsScehma");
const LocalUser = require("../../model/LocalUserSchema");
const mongoose = require("mongoose");
const savingsAccountSchemaValidation = require("../../schemaValidation/savingsAccountSchemaValidation");
const { savingAccountDepositCashHelper, savingAccountWithDrawCashHelper } = require("../../helper/laonDrawerBankCashHelper");
/**
 * Creates a new savings account
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} JSON response with success message or error
 */
const createSavingsAccountController = asyncHandler(async (req, res) => {
    const savingsBody = req.body;


    // Validate the request body
    const { error } = savingsAccountSchemaValidation.validate(savingsBody);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    // Create new savings account
    const newSavingsAccount = await SavingsAccount.create(savingsBody);
    if (!newSavingsAccount) {
        return res.status(404).json({ message: "Something Went Wrong" });
    }

    return res
        .status(200)
        .json({ message: "Savings account created successfully" });
});
const savingsAccountListByBrachAndSamityController = asyncHandler(
    async (req, res) => {
        const { branchId, samityId } = req.query;

        const data = await SavingsAccount.aggregate([
            {
                $match: {
                    branchId: new mongoose.Types.ObjectId(branchId),
                    samityId: new mongoose.Types.ObjectId(samityId),
                },
            },
            {
                $lookup: {
                    from: "localusers",
                    localField: "memberId",
                    foreignField: "_id",
                    as: "memberDetails",
                },
            },
            {
                $unwind: "$memberDetails",
            },
            {
                $project: {
                    _id: 1,
                    memberId: 1,
                    branchId: 1,
                    samityId: 1,
                    paymentTerm: 1,
                    openingDate: 1,
                    balance: 1,
                    totalDeposit: 1,
                    "memberDetails.name": 1,
                    "memberDetails.mobileNumber": 1,
                },
            },
        ]);
        return res.json({ data });
    }
);
/**
 * Retrieves specific details for a savings account
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} JSON response with account details
 */
const getSpecificDetailsForSavingsAccountController = asyncHandler(async (req, res) => {
    const _id = req.params.id;
    const id = new mongoose.Types.ObjectId(_id);

    // Aggregate pipeline to fetch account details with user information
    const data = await SavingsAccount.aggregate([
        { $match: { _id: id } },
        {
            $lookup: {
                from: "localusers",
                localField: "memberId",
                foreignField: "_id",
                as: "user"
            }
        },
        { $unwind: "$user" },
        {
            $project: {
                _id: 1,
                memberId: 1,
                paymentTerm: 1,
                branchId: 1,
                samityId: 1,
                profitPercentage: 1,
                openingDate: 1,
                balance: 1,
                profit: 1,
                totalDeposit: 1,
                status: 1,
                memberDetails: {
                    name: "$user.name",
                    mobileNumber: "$user.mobileNumber"
                }
            }
        }
    ])

    return res.json({ data })
});

/**
 * Handles deposit to a savings account
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} JSON response with success message or error
 */
const makeDepositController = asyncHandler(async (req, res) => {
    const body = req.body;
    const { date, amount, description, id } = body;
    let payFrom = body.payFrom;
    let by = body.by;
    delete body.payFrom;
    if (!date || !amount || !id) {
        return res.status(404).json({ message: "All Fields are Required" });
    }

    const depositAccount = await SavingsAccount.findOne({ _id: id });
    if (!depositAccount) {
        return res.status(404).json({ error: "Deposit account not found" });
    }

    // Calculate profit and update account balance
    let profit = Number(depositAccount.profitPercentage / 100) * Number(amount);
    depositAccount.balance += profit + amount;
    depositAccount.totalDeposit += amount;
    depositAccount.profit += profit;

    // Create and save transaction record
    const transaction = new SavingsAccountTransaction({ accountId: id, date, amount, description, by, });
    await Promise.all([transaction.save(), depositAccount.save(), savingAccountDepositCashHelper(payFrom, by, amount, date, 'Savings')]);

    return res.status(200).json({ message: "Deposit money saved successfully" });
});

/**
 * Handles withdrawal from a savings account
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} JSON response with success message or error
 */
const withdrawController = asyncHandler(async (req, res) => {
    const body = req.body;
    console.log(req.body, 'savingssssssss----');
    const { id, amount, date, description } = body;
    let payFrom = body.payFrom;
    let by = body.by;
    delete body.payFrom;


    // Validate input
    if (!id || !amount || isNaN(amount) || amount <= 0 || !date) {
        return res.status(400).json({ message: "Invalid memberId or amount" });
    }

    let depositAccount = await SavingsAccount.findOne({ _id: id });
    if (!depositAccount) {
        return res.status(404).json({ message: "Deposit account not found" });
    }

    // Check for sufficient balance
    if (amount > depositAccount.balance) {
        return res
            .status(400)
            .json({ message: "Insufficient balance for withdrawal" });
    }
    let expense = (depositAccount.profitPercentage / 100) * Number(amount);
    // Update account balance
    depositAccount.balance -= Number(amount);
    depositAccount.totalWithdraw += Number(amount);

    // Create and save withdrawal record
    const withdrawal = new SavingsAccountWithdraw({
        accountId: id,
        date,
        description: description,
        amount,
        by,
        expense
    });
    await Promise.all([withdrawal.save(), depositAccount.save(), savingAccountWithDrawCashHelper(payFrom, by, amount, date, 'Savings')]);
    console.log('withdraws done');
    return res
        .status(200)
        .json({ message: "Withdrawal successful", depositAccount });
});

/**
 * Retrieves withdrawal details for a specific account
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} JSON response with withdrawal details
 */
const withdrawDetailsController = asyncHandler(async (req, res) => {
    const _id = req.params.id;
    console.log('hit');
    console.log(_id);
    const id = new mongoose.Types.ObjectId(_id);
    const data = await SavingsAccountWithdraw.aggregate([
        { $match: { accountId: id } },
        { $sort: { date: -1 } }
    ])
    return res.json({ data });
});

/**
 * Retrieves transaction details for a specific account
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} JSON response with transaction details
 */
const transactionDetailsController = asyncHandler(async (req, res) => {
    const _id = req.params.id;
    const id = new mongoose.Types.ObjectId(_id);
    const data = await SavingsAccountTransaction.aggregate([
        { $match: { accountId: id } },
        { $sort: { date: -1 } }
    ])
    return res.json({ data })
});

module.exports = {
    createSavingsAccountController,
    makeDepositController,
    withdrawController,
    transactionDetailsController,
    withdrawDetailsController,
    getSpecificDetailsForSavingsAccountController,
    savingsAccountListByBrachAndSamityController
}