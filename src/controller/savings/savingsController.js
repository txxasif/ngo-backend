const asyncHandler = require("express-async-handler");
const { SavingsAccount } = require("../../model/SavingAccountsScehma");
const LocalUser = require("../../model/LocalUserSchema");
const mongoose = require("mongoose");
const savingsAccountSchemaValidation = require("../../schemaValidation/savingsAccountSchemaValidation");
const createSavingsAccountController = asyncHandler(async (req, res) => {
    const savingsBody = req.body;
    console.log(savingsBody);
    const { error } = savingsAccountSchemaValidation.validate(savingsBody);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    const { memberId } = savingsBody;

    const newSavingsAccount = await SavingsAccount.create(savingsBody);
    if (!newSavingsAccount) {
        return res.status(404).json({ message: "Something Went Wrong" });
    }
    return res
        .status(200)
        .json({ message: "Savings account created successfully" });
});

module.exports = { createSavingsAccountController }