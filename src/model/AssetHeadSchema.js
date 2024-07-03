const mongoose = require("mongoose");
const expenseSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },

    },
);

const AssetHead =
    mongoose.models.AssetHead || mongoose.model("AssetHead", expenseSchema);
module.exports = AssetHead;
