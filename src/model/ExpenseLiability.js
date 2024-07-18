const mongoose = require("mongoose");
const expenseLiabilitySchema = new mongoose.Schema(
    {
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
        headId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ExpenseHead",
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
        date: {
            type: Date,
            required: true,
        },
        paidDate: {
            type: Date,
        },
        status: {
            type: String,
            enum: ["paid", "unpaid"],
            default: "unpaid",
        },
        amount: {
            type: Number,
            default: 0,
            required: true,
        },


    }
);

const ExpenseLiability =
    mongoose.models.ExpenseLiability || mongoose.model("ExpenseLiability", expenseLiabilitySchema);
module.exports = ExpenseLiability;
