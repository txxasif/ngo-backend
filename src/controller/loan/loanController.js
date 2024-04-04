const asyncHandler = require("express-async-handler");
const loanAccountValidationSchema = require("../../schemaValidation/loanAccountValidationSchema");

// ! create new  loan account controller
const createNewLoanAccountController = asyncHandler(async (req, res) => {
  const loanBody = req.body;
  const { error } = loanAccountValidationSchema.validate(loanBody);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  return res.send(loanBody);
});

module.exports = {
  createNewLoanAccountController,
};
