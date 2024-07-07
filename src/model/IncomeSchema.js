const mongoose = require("mongoose");
const incomeHeadTransactionSchema = new mongoose.Schema(
    {
        headId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "IncomeHead",
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
        amount: {
            type: Number,
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
    }
)
const incomeHeadSchema = new mongoose.Schema(
    {
        head: {
            type: String,
            required: true,
        },

    },
    {
        timestamps: true,
    }
);

const IncomeHead =
    mongoose.models.IncomeHead ||
    mongoose.model("IncomeHead", incomeHeadSchema);
const IncomeHeadTransaction = mongoose.models.IncomeHeadTransaction || mongoose.model("IncomeHeadTransaction", incomeHeadTransactionSchema);
module.exports = IncomeHead, { IncomeHeadTransaction };
