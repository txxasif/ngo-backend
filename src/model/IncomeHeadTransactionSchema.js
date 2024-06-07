const mongoose = require("mongoose");
const incomeHeadTransactionSchema = new mongoose.Schema(
    {
        headId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "IncomeHead",
            required: true,
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
const IncomeHeadTransaction = mongoose.models.IncomeHeadTransaction || mongoose.model("IncomeHeadTransaction", incomeHeadTransactionSchema);
module.exports = IncomeHeadTransaction;
