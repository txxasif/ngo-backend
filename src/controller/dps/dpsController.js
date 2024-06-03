const asyncHandler = require("express-async-handler");
const { DpsAccount } = require("../../model/DpsAccountSchema");
const dpsAccountSchemaValidation = require("../../schemaValidation/dpsSchemaValidation");
const createDpsAccountController = asyncHandler(async (req, res) => {
    const dpsBody = req.body;
    console.log(dpsBody, 'xx');
    const { error } = dpsAccountSchemaValidation.validate(dpsBody);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const newDpsAccount = await DpsAccount.create(dpsBody);
    if (!newDpsAccount) {
        return res.status(404).json({ message: "Something Went Wrong" });
    }
    return res
        .status(200)
        .json({ message: "Savings account created successfully" });
});

module.exports = { createDpsAccountController }