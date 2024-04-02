const asyncHandler = require("express-async-handler");
const {
  depositAccountSchema,
} = require("../../schemaValidation/depositAccount");

// * create deposit account

const createDepositAccountController = asyncHandler(async (req, res) => {
  const depositBody = req.body;
  const { error } = depositAccountSchema.validate(depositBody);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  res.json({ message: "done" });
});

module.exports = {
  createDepositAccountController,
};
