const asyncHandler = require("express-async-handler");
const { DpsAccount, DpsAccountTransaction, DpsAccountWithdraw } = require("../../model/DpsAccountSchema");
const mongoose = require("mongoose");
const dpsAccountSchemaValidation = require("../../schemaValidation/dpsSchemaValidation");
const { savingAccountDepositCashHelper, savingAccountWithDrawCashHelper } = require("../../helper/laonDrawerBankCashHelper");
const createDpsAccountController = asyncHandler(async (req, res) => {
    const dpsBody = req.body;

    const { error } = dpsAccountSchemaValidation.validate(dpsBody);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const newDpsAccount = await DpsAccount.create(dpsBody);
    if (!newDpsAccount) {
        return res.status(404).json({ message: "Something Went Wrong" });
    }
    return res
        .status(200)
        .json({ message: "Savings account created successfully" });
});
const getSpecificDetailsForDpsAccountController = asyncHandler(async (req, res) => {
    const _id = req.params.id;

    const id = new mongoose.Types.ObjectId(_id);
    const data = await DpsAccount.aggregate([
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
                periodOfTimeInMonths: 1,
                profitPercentage: 1,
                samityId: 1,
                openingDate: 1,
                balance: 1,
                totalDeposit: 1,
                totalWithdraw: 1,
                status: 1,
                matureDate: 1,

                memberDetails: {
                    name: "$user.name",
                    mobileNumber: "$user.mobileNumber"
                }
            }
        }
    ])

    return res.json({ data })
});
const makeDepositController = asyncHandler(async (req, res) => {
    const body = req.body;
    const { date, amount, description, id } = body;
    let payFrom = body.payFrom;
    let by = body.by;
    delete body.payFrom;
    if (!date || !amount || !id || !payFrom || !by) {
        return res.status(404).json({ message: "All Fields are Required" });
    }
    const depositAccount = await DpsAccount.findOne({ _id: id });
    if (!depositAccount) {
        return res.status(404).json({ error: "Dps account not found" });
    }
    if (Number(amount) < 500) {
        return res.status(400).json({ message: "DPS Installment Amount should be greater than 500tk." });
    }
    let profit = ((amount * (depositAccount.profitPercentage / 100)) / 365) * (depositAccount.periodOfTimeInMonths * 30);
    let newBalance = profit + Number(amount) + depositAccount.balance;


    depositAccount.balance = newBalance.toFixed(2);
    depositAccount.profit = profit;
    depositAccount.totalDeposit += Number(amount);
    const transaction = new DpsAccountTransaction({ accountId: id, date, amount, description, by });
    await Promise.all([
        transaction.save(),
        depositAccount.save(),
        savingAccountDepositCashHelper(payFrom, by, amount, date, 'DPS')
    ]);
    return res.status(200).json({ message: "Deposit money saved successfully" });
});
const dpsAccountListByBrachAndSamityController = asyncHandler(
    async (req, res) => {
        const { branchId, samityId } = req.query;

        const data = await DpsAccount.aggregate([
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
                    totalWithdraw: 1,
                    "memberDetails.name": 1,
                    "memberDetails.mobileNumber": 1,
                },
            },
        ]);
        return res.json({ data });
    }
);
// * withdrawAccount
const withdrawController = asyncHandler(async (req, res) => {
    const body = req.body;
    const { id, amount, date, description } = body;
    let payFrom = body.payFrom;
    let by = body.by;
    delete body.payFrom;
    // Validate memberId and amount
    if (!id || !amount || isNaN(amount) || amount <= 0 || !date) {
        return res.status(400).json({ message: "Invalid memberId or amount" });
    }


    // Find the deposit account by memberId
    let depositAccount = await DpsAccount.findOne({ _id: id });

    if (!depositAccount) {
        return res.status(404).json({ message: "Dps account not found" });
    }

    // Ensure sufficient balance for withdrawal
    if (amount > depositAccount.balance) {
        return res
            .status(400)
            .json({ message: "Insufficient balance for withdrawal" });
    }
    let expense = ((Number(amount) * (depositAccount.profitPercentage / 100)) / 365) * (depositAccount.periodOfTimeInMonths * 30);

    // Update balance
    depositAccount.balance -= Number(amount);
    depositAccount.totalWithdraw += Number(amount);

    // Create a new withdrawal
    const withdrawal = new DpsAccountWithdraw({
        accountId: id,
        date,
        description: description,
        amount,
        by,
        expense
    });

    // Save withdrawal and deposit account
    await Promise.all([withdrawal.save(), depositAccount.save(), savingAccountWithDrawCashHelper(payFrom, by, amount, date, 'DPS')]);

    // Return success response
    return res
        .status(200)
        .json({ message: "Withdrawal successful", depositAccount });
});
const withdrawDetailsController = asyncHandler(async (req, res) => {
    const _id = req.params.id;
    const id = new mongoose.Types.ObjectId(_id);
    const data = await DpsAccountWithdraw.aggregate([{
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
    const data = await DpsAccountTransaction.aggregate([{
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

module.exports = { dpsAccountListByBrachAndSamityController, createDpsAccountController, transactionDetailsController, withdrawController, withdrawDetailsController, getSpecificDetailsForDpsAccountController, withdrawDetailsController, makeDepositController }