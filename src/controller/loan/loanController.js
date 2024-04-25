const asyncHandler = require("express-async-handler");
const loanAccountValidationSchema = require("../../schemaValidation/loanAccountValidationSchema");
const { LoanAccount } = require("../../model/LoanAccountSchema");
const LocalUser = require("../../model/LocalUserSchema");
const mongoose = require("mongoose");
const Samity = require("../../model/SamitySchema");

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
  const samity = await Samity.findOne({ _id: loanBody.samityId });
  samity.loanInField += Number(loanBody.loanAmount);
  await samity.save();
  if (!newLoanAccount) {
    return res.status(404).json({ message: "Something Went Wrong" });
  }
  return res.status(200).json({ message: "Loan account created successfully" });
});
// * search loan account
const searchLoanAccountController = asyncHandler(async (req, res) => {
  const phone = req.params.id;
  const user = await LocalUser.findOne({ mobileNumber: phone })
    .select("_id name samityId")
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

const payLoanAccountController = asyncHandler(async (req, res) => {
  const body = req.body;
  const isLoanAccount = await LoanAccount.findOne({ memberId: body.memberId });
  const { amount } = body;

  isLoanAccount.paid += amount;
  await isLoanAccount.save();
  console.log(body);
  res.json({ message: "done" });
});

const getLoanAccountsByBranchAndSamityId = asyncHandler(async (req, res) => {
  try {
    const { branchId, samityId, paymentTerm } = req.query;

    const loanAccounts = await LoanAccount.aggregate([
      // Match documents based on provided parameters
      {
        $match: {
          branchId: new mongoose.Types.ObjectId(branchId),
          samityId: new mongoose.Types.ObjectId(samityId),
          paymentTerm,
        },
      },
      // Perform lookup to fetch related data from other collections
      {
        $lookup: {
          from: "samities",
          localField: "samityId",
          foreignField: "_id",
          as: "samity",
        },
      },
      {
        $lookup: {
          from: "branches",
          localField: "branchId",
          foreignField: "_id",
          as: "branch",
        },
      },
      {
        $lookup: {
          from: "localusers",
          localField: "memberId",
          foreignField: "_id",
          as: "user",
        },
      },
      // Project the required fields
      {
        $project: {
          SamityName: { $arrayElemAt: ["$samity.samityName", 0] },
          BranchName: { $arrayElemAt: ["$branch.branchName", 0] },
          UserName: { $arrayElemAt: ["$user.name", 0] },
          paymentTerm: 1,
          loanAmount: 1,
          paid: 1,
        },
      },
    ]);
    console.log(loanAccounts);
    res.json(loanAccounts);
  } catch (error) {
    console.error("Error fetching loan accounts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
const countLoanProfitController = asyncHandler(async (req, res) => {
  const { branchId, samityId } = req.query;
  console.log(branchId, samityId);
  const loanAccounts = await LoanAccount.find({
    branchId: new mongoose.Types.ObjectId(branchId),
    samityId: new mongoose.Types.ObjectId(samityId),
  }).lean();
  const totalProfit = loanAccounts.reduce((total, account) => {
    console.log(account);
    if (account.paid > account.loanAmount) {
      return total + (Number(account.paid) - Number(account.loanAmount));
    }
  }, 0);

  const localUsers = await LocalUser.find({
    branchId: new mongoose.Types.ObjectId(branchId),
    samityId: new mongoose.Types.ObjectId(samityId),
  }).lean();
  const membershipFee = localUsers.reduce((acc, user) => {
    return acc + user.membershipFee;
  }, 0);
  const data = {
    totalProfit: totalProfit ? totalProfit : 0,
    membershipFee: membershipFee ? membershipFee : 0,
  };
  console.log(data);
  res.json({ data });
});
module.exports = {
  createNewLoanAccountController,
  searchLoanAccountController,
  getLoanAccountsByBranchAndSamityId,
  payLoanAccountController,
  countLoanProfitController,
};
