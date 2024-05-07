const asyncHandler = require("express-async-handler");
const loanAccountValidationSchema = require("../../schemaValidation/loanAccountValidationSchema");
const { LoanAccount } = require("../../model/LoanAccountSchema");
const LocalUser = require("../../model/LocalUserSchema");
const mongoose = require("mongoose");
const Samity = require("../../model/SamitySchema");
const ngoLoanSchemaValidation = require("../../schemaValidation/ngoLoanSchemaValidation");
const { NgoLoan, NgoLoanTransaction } = require("../../model/NgoLoanSchema");

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
    if (paymentTerm) {
      console.log(null);
    }
    let params =
      paymentTerm != "null"
        ? { branchId, samityId, paymentTerm }
        : { branchId, samityId };
    console.log(params);

    const loanAccounts = await LoanAccount.aggregate([
      // Match documents based on provided parameters
      {
        $match: {
          branchId: new mongoose.Types.ObjectId(branchId),
          samityId: new mongoose.Types.ObjectId(samityId),
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
          photo: { $arrayElemAt: ["$user.photo", 0] },
          paymentTerm: 1,
          loanAmount: 1,
          paid: 1,
        },
      },
    ]);

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
  console.log(loanAccounts.length);
  let totalProfit = 0;
  for (let i = 0; i < loanAccounts.length; i++) {
    if (loanAccounts[i].paid > loanAccounts[i].loanAmount) {
      totalProfit += loanAccounts[i].paid - loanAccounts[i].loanAmount;
    }
  }
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
  console.log(totalProfit, "hi");
  res.json({ data });
});
const ngoLoanCreateController = asyncHandler(async (req, res) => {
  const loanBody = req.body;
  console.log(loanBody);
  const { error } = ngoLoanSchemaValidation.validate(loanBody);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const newLoanAccount = new NgoLoan(loanBody);
  await newLoanAccount.save();
  return res.json({ message: " done" });
});
const ngoLoanPayListController = asyncHandler(async (req, res) => {
  console.log("hi");
  let data = [];
  try {
    const response = await NgoLoan.find({}).lean();
    data = response;
  } catch (err) {
    data = [];
  }

  return res.json({ data: data });
});

const ngoLoanPayController = asyncHandler(async (req, res) => {
  const body = req.body;
  console.log(body);
  const { ngoLoanId, amount, date } = body;
  if (!ngoLoanId || !amount || !date) {
    return res.status(404).json({ message: "All fields are required" });
  }
  const ngoLoanAccount = await NgoLoan.findOne({ _id: ngoLoanId });
  ngoLoanAccount.totalPaid += amount;
  await ngoLoanAccount.save();
  const newTransaction = new NgoLoanTransaction(body);
  await newTransaction.save();
  return res.json({ message: "Payment Done" });
});
const ngoLoanPaymentDetailsByLoanIdController = asyncHandler(
  async (req, res) => {
    const id = req.params.id;

    const ngoLoanDetails = await NgoLoan.findOne({ _id: id })
      .select("nameOfInstitute totalAmount perInstallment totalPaid")
      .lean();

    const transactionDetails = await NgoLoanTransaction.find({
      ngoLoanId: id,
    }).lean();
    const data = {
      transactionDetails: transactionDetails,
      ngoLoanDetails,
    };

    return res.json({ data });
  }
);

module.exports = {
  createNewLoanAccountController,
  searchLoanAccountController,
  getLoanAccountsByBranchAndSamityId,
  payLoanAccountController,
  countLoanProfitController,
  ngoLoanCreateController,
  ngoLoanPaymentDetailsByLoanIdController,
  ngoLoanPayController,
  ngoLoanPayListController,
};
