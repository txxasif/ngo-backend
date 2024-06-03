const asyncHandler = require("express-async-handler");
const { SavingsAccount } = require("../../model/SavingAccountsScehma");
const LocalUser = require("../../model/LocalUserSchema");
const mongoose = require("mongoose");
const savingsAccountSchemaValidation = require("../../schemaValidation/savingsAccountSchemaValidation");
const { Withdraw, Transaction } = require("../../model/DepositAccountSchema");
const createSavingsAccountController = asyncHandler(async (req, res) => {
    const savingsBody = req.body;
    console.log(savingsBody);
    const { error } = savingsAccountSchemaValidation.validate(savingsBody);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    const { memberId } = savingsBody;

    const newSavingsAccount = await SavingsAccount.create(savingsBody);
    if (!newSavingsAccount) {
        return res.status(404).json({ message: "Something Went Wrong" });
    }
    return res
        .status(200)
        .json({ message: "Savings account created successfully" });
});
const getSpecificDetailsForSavingsAccountController = asyncHandler(async (req, res) => {
    const _id = req.params.id;
    const id = new mongoose.Types.ObjectId(_id);
    const data = await SavingsAccount.aggregate([
        {
            $match: {
                _id: id
            }
        },
        {
            $lookup: {
                from: "localusers",
                localField: "memberId",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            $unwind: "$user"
        },
        {
            $project: {
                _id: 1,
                memberId: 1,
                paymentTerm: 1,
                profitPercentage: 1,
                openingDate: 1,
                balance: 1,
                totalDeposit: 1,
                status: 1,
                memberDetails: {
                    name: "$user.name",
                    mobileNumber: "$user.mobileNumber"
                }
            }
        }
    ])
    console.log(data);
    return res.json({ data })
});
const makeDepositController = asyncHandler(async (req, res) => {
    const { date, amount, description, id } = req.body;
    console.log(req.body);
    if (!date || !amount || !id) {
        return res.status(404).json({ message: "All Fields are Required" });
    }
    const depositAccount = await SavingsAccount.findOne({ _id: id });

    if (!depositAccount) {
        return res.status(404).json({ error: "Deposit account not found" });
    }
    let profit = Number(depositAccount.profitPercentage / 100) * Number(amount);
    depositAccount.balance += profit + amount;
    depositAccount.totalDeposit += amount;
    const transaction = new Transaction({ accountId: id, date, amount, description });
    await transaction.save();
    await depositAccount.save();
    return res.status(200).json({ message: "Deposit money saved successfully" });
});

// * withdrawAccount
const withdrawController = asyncHandler(async (req, res) => {
    const { id, amount, date, description } = req.body;
    console.log(req.body);

    // Validate memberId and amount
    if (!id || !amount || isNaN(amount) || amount <= 0 || !date) {
        return res.status(400).json({ message: "Invalid memberId or amount" });
    }

    // Find the deposit account by memberId
    let depositAccount = await SavingsAccount.findOne({ _id: id });

    if (!depositAccount) {
        return res.status(404).json({ message: "Deposit account not found" });
    }

    // Ensure sufficient balance for withdrawal
    if (amount > depositAccount.balance) {
        return res
            .status(400)
            .json({ message: "Insufficient balance for withdrawal" });
    }

    // Update balance
    depositAccount.balance -= Number(amount);

    // Create a new withdrawal
    const withdrawal = new Withdraw({
        accountId: id,
        date,
        description: description,
        amount,
    });

    // Add the withdrawal to deposit account
    await withdrawal.save();

    // Save the updated deposit account
    await depositAccount.save();

    // Return success response
    return res
        .status(200)
        .json({ message: "Withdrawal successful", depositAccount });
});

const withdrawDetailsController = asyncHandler(async (req, res) => {
    const _id = req.params.id;
    const id = new mongoose.Types.ObjectId(_id);
    const data = await Withdraw.aggregate([{
        $match: {
            accountId: id
        }
    }, {
        $sort: {
            date: -1
        }
    }])
    return res.json({ data })
});
const transactionDetailsController = asyncHandler(async (req, res) => {
    const _id = req.params.id;
    const id = new mongoose.Types.ObjectId(_id);
    const data = await Transaction.aggregate([{
        $match: {
            accountId: id
        }
    }, {
        $sort: {
            date: -1
        }
    }])
    return res.json({ data })
});

module.exports = { createSavingsAccountController, makeDepositController, withdrawController, transactionDetailsController, withdrawDetailsController, getSpecificDetailsForSavingsAccountController }