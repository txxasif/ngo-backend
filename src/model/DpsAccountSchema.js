const mongoose = require("mongoose");

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

module.exports = { DpsAccount };
