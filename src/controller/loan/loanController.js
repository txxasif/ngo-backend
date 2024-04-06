const asyncHandler = require("express-async-handler");
const loanAccountValidationSchema = require("../../schemaValidation/loanAccountValidationSchema");
const { LoanAccount } = require("../../model/LoanAccountSchema");
const LocalUser = require("../../model/LocalUserSchema");

// ! create new  loan account controller
const createNewLoanAccountController = asyncHandler(async (req, res) => {
  const loanBody = req.body;
  const { error } = loanAccountValidationSchema.validate(loanBody);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { memberId } = loanBody;
  const isAlreadyExist = await LoanAccount.findOne({ memberId: memberId });
  if (isAlreadyExist) {
    return res.status(404).json({ message: "Loan account already exists" });
  }
  const newLoanAccount = await LoanAccount.create(loanBody);
  if (!newLoanAccount) {
    return res.status(404).json({ message: "Something Went Wrong" });
  }
  return res.status(200).json({ message: "Loan account created successfully" });
});
// * search loan account
const searchLoanAccountController = asyncHandler(async (req, res) => {
  const phone = req.params.id;
  const user = await LocalUser.findOne({ mobileNumber: phone })
    .select("_id name")
    .lean();
  if (!user) {
    return res.status(404).json({ message: "No user data available" });
  }
  const isLoanAccount = await LoanAccount.findOne({
    memberId: user._id,
  }).lean();
  if (!isLoanAccount) {
    return res.status(404).json({ message: "No Loan Account Available" });
  }
  delete isLoanAccount._id;
  const finalResponse = { ...user, ...isLoanAccount };
  return res.status(200).json({ data: [finalResponse] });
});

module.exports = {
  createNewLoanAccountController,
  searchLoanAccountController,
};
