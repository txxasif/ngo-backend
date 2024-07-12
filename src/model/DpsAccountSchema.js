const mongoose = require("mongoose");
const transactionSchema = new mongoose.Schema({
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
    by: {
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
}, {
    timestamps: true,
});
const withdrawSchema = new mongoose.Schema({
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
    expense: {
        type: Number,
        default: 0
    },
    description: {
        type: String
    },
    by: {
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


}, {
    timestamps: true,
});
const dpsAccountSchema = new mongoose.Schema(
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
        paymentTerm: {
            type: String,
            enum: [
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
        profit: {
            type: Number,
            default: 0
        },

        profitPercentage: {
            type: Number,
            required: true,
        },

        openingDate: {
            type: Date,
            required: true,
        },
        matureDate: {
            type: Date,
            required: true,
        },

        balance: {
            type: Number,
            default: 0,
        },
        totalWithdraw: {
            type: Number,
            default: 0
        },
        totalDeposit: {
            type: Number,
            default: 0
        },
        closingRequest: {
            type: Boolean,
            default: false,
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'closed']
        }
    },
    {
        timestamps: true,
    }
);

const DpsAccount =
    mongoose.models.DpsAccount ||
    mongoose.model("DpsAccount", dpsAccountSchema);
const DpsAccountTransaction =
    mongoose.models.DpsAccountTransaction ||
    mongoose.model("DpsAccountTransaction", transactionSchema);
const DpsAccountWithdraw =
    mongoose.models.DpsAccountWithdraw || mongoose.model("DpsAccountWithdraw", withdrawSchema);

module.exports = { DpsAccount, DpsAccountTransaction, DpsAccountWithdraw };
