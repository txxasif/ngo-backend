const asyncHandler = require("express-async-handler");
const { FdrAccount } = require("../../model/FdrAccountSchema");
const fdrAccountSchemaValidation = require("../../schemaValidation/fdrSchemaValidation");
const createFdrAccountController = asyncHandler(async (req, res) => {
    const fdrBody = req.body;
    console.log(fdrBody);
    const { error } = fdrAccountSchemaValidation.validate(fdrBody);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const newFdrAccount = await FdrAccount.create(fdrBody);
    if (!newFdrAccount) {
        return res.status(404).json({ message: "Something Went Wrong" });
    }
    return res
        .status(200)
        .json({ message: "Savings account created successfully" });
});

module.exports = { createFdrAccountController }