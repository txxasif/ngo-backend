const mongoose = require("mongoose");
const expenseSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },

    },
);

const ExpenseHead =
    mongoose.models.ExpenseHead || mongoose.model("ExpenseHead", expenseSchema);
module.exports = ExpenseHead;
