const mongoose = require("mongoose");
const transactionSchema = new mongoose.Schema(
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
        status: {
            type: String,
            enum: ['paid', 'unpaid'],
        },
        capital: {
            type: Boolean,
            default: false
        },
        by: {
            name: {
                type: String,

            },
            phone: {
                type: String,

            },
            type: {
                type: String,

            },
        },

    },
    {
        timestamps: true,
    }
);
const fdrAccountSchema = new mongoose.Schema(
    {
        memberId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "LocalUser",
            required: true,
        },
        branchId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Branch",
            required: true,
        },
        samityId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Samity",
            required: true,
        },
        type: {
            type: String,
            enum: [
                "flat",
                "percentage",
            ],
            required: true,
        },

        paymentTerm: {
            type: String,
            enum: [
                "At a Time",
                "Monthly",
                "Quarterly",
                "Half-Yearly",
                "Yearly",
            ],
            required: true,
        },
        periodOfTimeInMonths: {
            type: Number,
            required: true,
        },
        profitPercentage: {
            type: Number,
            required: true,
        },
        onMatureAmount: {
            type: Number,
            required: true,
        },
        openingDate: {
            type: Date,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        matureDate: {
            type: Date,
            required: true,
        },
        profitPerInstallment: {
            type: Number,
            required: true,
        },
        totalInstallment: {
            type: Number,
            required: true,
        },
        balance: {
            type: Number,
            default: 0,
        },
        totalWithdraw: {
            type: Number,
            default: 0,
        },
        closingRequest: {
            type: Boolean,
            default: false,
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'closed']
        },
        openedBy: {
            name: {
                type: String,
                required: true,
            },
            phone: {
                type: String,
                required: true,
            },
            type: {
                type: String,
                required: true,
            },
        },
    },
    {
        timestamps: true,
    }
);

const FdrAccount =
    mongoose.models.FdrAccount ||
    mongoose.model("FdrAccount", fdrAccountSchema);
const TransactionFdr =
    mongoose.models.TransactionFdr ||
    mongoose.model("TransactionFdr", transactionSchema);
module.exports = { FdrAccount, TransactionFdr };
