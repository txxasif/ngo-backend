const asyncHandler = require("express-async-handler");
const { FdrAccount } = require("../../model/FdrAccountSchema");
const fdrAccountSchemaValidation = require("../../schemaValidation/fdrSchemaValidation");
const mongoose = require("mongoose");
const { Transaction, Withdraw } = require("../../model/DepositAccountSchema");

const createFdrAccountController = asyncHandler(async (req, res) => {
    const fdrBody = req.body;
    console.log(fdrBody);
    const { error } = fdrAccountSchemaValidation.validate(fdrBody);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    const { onMatureAmount } = fdrBody;
    const newBody = {
        balance: onMatureAmount,
        ...fdrBody
    }

    const newFdrAccount = await FdrAccount.create(newBody);
    if (!newFdrAccount) {
        return res.status(404).json({ message: "Something Went Wrong" });
    }
    return res
        .status(200)
        .json({ message: "Savings account created successfully" });
});
const getSpecificDetailsForFdrAccountController = asyncHandler(async (req, res) => {
    const _id = req.params.id;
    const id = new mongoose.Types.ObjectId(_id);
    const data = await FdrAccount.aggregate([
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
                type: 1,
                periodOfTimeInMonths: 1,
                profitPerInstallment: 1,
                profitPercentage: 1,
                openingDate: 1,
                balance: 1,
                totalWithdraw: 1,
                status: 1,
                amount: 1,
                matureDate: 1,

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
    const depositAccount = await FdrAccount.findOne({ _id: id });

    if (!depositAccount) {
        return res.status(404).json({ error: "Deposit account not found" });
    }
    if (amount !== depositAccount.perInstallment) {
        return res.status(404).json({ message: "Amount should be equal to per installment" });
    }
    let balance = depositAccount.profitPerInstalment + amount + depositAccount.balance;

    depositAccount.balance = balance.toFixed(2);
    depositAccount.totalDeposit += Number(amount)
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
    let depositAccount = await FdrAccount.findOne({ _id: id });

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
    depositAccount.totalWithdraw += Number(amount);

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
    console.log(data, 'hi');
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

module.exports = { createFdrAccountController, getSpecificDetailsForFdrAccountController, withdrawController, transactionDetailsController, makeDepositController, withdrawDetailsController }