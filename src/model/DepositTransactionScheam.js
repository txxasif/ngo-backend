

const mongoose = require("mongoose");
// Transaction Schema
const depositTransactionSchema = new mongoose.Schema(
    {
        accountId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "DepositAccount",
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);
const depositWithdrawSchema = new mongoose.Schema(
    {
        accountId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "DepositAccount",
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        description: {
            type: String
        }


    },
    {
        timestamps: true,
    }
);

const DepositTransaction = mongoose.models.DepositTransaction || mongoose.model("DepositTransaction", depositTransactionSchema);
const DepositWithdraw = mongoose.models.DepositWithdraw || mongoose.model("DepositWithdraw", depositWithdrawSchema);
module.exports = { DepositTransaction, DepositWithdraw }