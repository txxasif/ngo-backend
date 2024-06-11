const mongoose = require("mongoose");
const bankCashSchema = new mongoose.Schema(
    {
        bankId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Bank",
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        transactionDetails: {
            date: {
                type: Date,
                required: true,
            },
            sourceDetails: {
                type: String,
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
        },
        type: {
            type: String,
            enum: ["cashIn", "cashOut"],
            default: "cashIn",
        },
    },
    {
        timestamps: true,
    }
);

const BankCash = mongoose.models.BankCash || mongoose.model("BankCash", bankCashSchema);
module.exports = BankCash;

