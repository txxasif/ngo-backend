const asyncHandler = require("express-async-handler");
const {
  depositAccountSchema,
} = require("../../schemaValidation/depositAccount");
const {
  DepositAccount,
  Withdraw,
  Transaction,
} = require("../../model/DepositAccountSchema");
const { message } = require("../../schemaValidation/localUser");
const LocalUser = require("../../model/LocalUserSchema");

// * create deposit account

const createDepositAccountController = asyncHandler(async (req, res) => {
  const depositBody = req.body;
  const { error } = depositAccountSchema.validate(depositBody);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const { memberId } = depositBody;
  const isAlreadyExist = await DepositAccount.findOne({ memberId: memberId });
  if (isAlreadyExist) {
    return res.status(404).json({ message: "Deposit account already exists" });
  }
  const newDepositAccount = await DepositAccount.create(depositBody);
  if (!newDepositAccount) {
    return res.status(404).json({ message: "Something Went Wrong" });
  }
  return res
    .status(200)
    .json({ message: "Deposit account created successfully" });
});
// * search deposit account
const searchDepositAccountController = asyncHandler(async (req, res) => {
  const phone = req.params.id;
  const user = await LocalUser.findOne({ mobileNumber: phone })
    .select("_id name")
    .lean();
  if (!user) {
    return res.status(404).json({ message: "No user data available" });
  }
  const isDepositAccount = await DepositAccount.findOne({
    memberId: user._id,
  }).lean();
  if (!isDepositAccount) {
    return res.status(404).json({ message: "No Deposit Account Available" });
  }
  console.log(isDepositAccount);
  const finalResponse = { ...user, ...isDepositAccount };
  return res.status(200).json({ data: [finalResponse] });
});
const makeDepositController = asyncHandler(async (req, res) => {});
module.exports = {
  createDepositAccountController,
  searchDepositAccountController,
};
