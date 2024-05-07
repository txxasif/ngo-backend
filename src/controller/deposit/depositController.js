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
  delete isDepositAccount._id;
  const finalResponse = { ...user, ...isDepositAccount };
  return res.status(200).json({ data: [finalResponse] });
});
const makeDepositController = asyncHandler(async (req, res) => {
  const { date, amount, description, memberId } = req.body;
  if (!date || !amount || !description || !memberId) {
    return res.status(404).json({ message: "All Fields are Required" });
  }
  const depositAccount = await DepositAccount.findOne({ memberId: memberId });
  if (!depositAccount) {
    return res.status(404).json({ error: "Deposit account not found" });
  }
  depositAccount.balance += Number(amount);
  const transaction = new Transaction({ date, amount, description });
  depositAccount.transactions.push(transaction);
  await depositAccount.save();
  return res.status(200).json({ message: "Deposit money saved successfully" });
});

// * withdrawAccount
const withdrawController = asyncHandler(async (req, res) => {
  const { memberId, amount } = req.body;

  // Validate memberId and amount
  if (!memberId || !amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ message: "Invalid memberId or amount" });
  }

  // Find the deposit account by memberId
  let depositAccount = await DepositAccount.findOne({ memberId });

  if (!depositAccount) {
    return res.status(404).json({ message: "Deposit account not found" });
  }

  // Ensure sufficient balance for withdrawal
  if (amount > depositAccount.balance) {
    return res
      .status(400)
      .json({ message: "Insufficient balance for withdrawal" });
  }

  // Update balance
  depositAccount.balance -= Number(amount);

  // Create a new withdrawal
  const withdrawal = new Withdraw({
    date: new Date(),
    amount,
  });

  // Add the withdrawal to deposit account
  depositAccount.withdraws.push(withdrawal);

  // Save the updated deposit account
  await depositAccount.save();

  // Return success response
  return res
    .status(200)
    .json({ message: "Withdrawal successful", depositAccount });
});
const depositAccountListByBrachAndSamityController = asyncHandler(
  async (req, res) => {
    const { branchId, samityId } = req.query;
    const data = await DepositAccount.find({
      branchId: branchId,
      samityId: samityId,
    }).lean();
    console.log(data);

    return res.json({ data });
  }
);
module.exports = {
  createDepositAccountController,
  makeDepositController,
  searchDepositAccountController,
  withdrawController,
  depositAccountListByBrachAndSamityController,
};
