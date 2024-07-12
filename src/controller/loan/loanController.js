const asyncHandler = require("express-async-handler");
const loanAccountValidationSchema = require("../../schemaValidation/loanAccountValidationSchema");
const {
  LoanAccount,
  LoanTransaction,
} = require("../../model/LoanAccountSchema");
const LocalUser = require("../../model/LocalUserSchema");
const mongoose = require("mongoose");
const Samity = require("../../model/SamitySchema");
const ngoLoanSchemaValidation = require("../../schemaValidation/ngoLoanSchemaValidation");
const { NgoLoan, NgoLoanTransaction } = require("../../model/NgoLoanSchema");
const moment = require("moment");
const { SavingsAccount } = require("../../model/SavingAccountsScehma");
const { loanDrawerBankCashHelper, loanReceiverBankCashHelper, savingAccountWithDrawCashHelper, ngoLoanReceiverCashHelper } = require("../../helper/laonDrawerBankCashHelper");


const createNewLoanAccountController = asyncHandler(async (req, res) => {
  const loanBody = req.body;
  let payFrom = loanBody.payFrom;
  let openedBy = loanBody.openedBy;
  let loanAmount = loanBody.loanAmount;
  let branchId = loanBody.branchId;
  let openingDate = loanBody.openingDate;
  delete loanBody.payFrom;
  const { error } = loanAccountValidationSchema.validate(loanBody);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const newLoanAccount = await LoanAccount.create(loanBody);
  await loanDrawerBankCashHelper(payFrom, openedBy, loanAmount, branchId, openingDate);

  if (!newLoanAccount) {
    return res.status(404).json({ message: "Something Went Wrong" });
  }
  return res.status(200).json({ message: "Loan account created successfully" });
});
// * search loan account
const searchLoanAccountController = asyncHandler(async (req, res) => {
  const phone = req.params.id;
  const pipeline = [
    {
      $match: { mobileNumber: phone }, // Filter by mobile number
    },
    {
      $lookup: {
        from: "samities", // Local field to join on
        localField: "samityId",
        foreignField: "_id", // Foreign field to join on
        as: "samityDetails", // Alias for joined data
      },
    },
    {
      $lookup: {
        from: "branches",
        localField: "branchId",
        foreignField: "_id",
        as: "branchDetails",
      },
    },
    {
      $unwind: "$samityDetails", // Unwind single document array from lookup
    },
    {
      $unwind: "$branchDetails", // Unwind single document array from lookup
    },
    {
      $project: {
        _id: 1,
        name: 1,
        photo: 1,
        samityName: "$samityDetails.samityName", // Access nested data
        branchName: "$branchDetails.branchName", // Access nested data
      },
    },
  ];
  const user = await LocalUser.aggregate(pipeline);
  if (!user.length) {
    console.log("erro");
    return res.status(404).json({ message: "No user data available" });
  }
  const isLoanAccount = await LoanAccount.find({
    memberId: user[0]._id,
  })
    .select(
      "totalAmount numberOfInstallment paymentTerm openingDate expiryDate isClosed paid"
    )
    .lean();
  if (!isLoanAccount) {
    return res.status(404).json({ message: "No Loan Account Available" });
  }
  const finalResponse = { userDetails: user[0], loanAccounts: isLoanAccount };
  return res.status(200).json({ data: [finalResponse] });
});
// ?search transactions of loan accounts
const searchLoanAccountsTransactionsController = asyncHandler(
  async (req, res) => {
    const id = req.params.id;
    const loanAccountDetails = await LoanAccount.findOne({ _id: id })
    let isCloseAble = loanAccountDetails.paid >= loanAccountDetails.totalAmount && loanAccountDetails.loanFinePaid >= loanAccountDetails.loanFine;
    console.log(isCloseAble);
    if (isCloseAble) {
      loanAccountDetails.status = "closed";
      await loanAccountDetails.save();
    }
    const transactionDetails = await LoanTransaction.find({ loanId: id }).sort({
      createdAt: -1,
    });

    const memberId = loanAccountDetails.memberId;

    const depositAccounts = await SavingsAccount.find({ memberId: memberId }).select('balance _id').lean();
    return res.json({ data: { transactionDetails, loanAccountDetails, depositAccounts, isCloseAble } });
  }
);

const payLoanAccountController = asyncHandler(async (req, res) => {
  const body = req.body;
  const { loanId, amount, addFineAmount, payFineAmount, date, by } = body;

  let payFrom = body.payFrom;
  delete body.payFrom;

  const selectedLoanAccount = await LoanAccount.findOne({ _id: loanId });
  if (addFineAmount > 0) {
    selectedLoanAccount.loanFine += addFineAmount;
  }
  if (payFineAmount > 0) {
    selectedLoanAccount.loanFinePaid += payFineAmount;
  }

  const lastBalance = selectedLoanAccount.paid;
  const newBalance = lastBalance + amount;

  let profit = 0;
  if (newBalance > selectedLoanAccount.loanAmount) {
    if (lastBalance < selectedLoanAccount.loanAmount) {
      // This transaction crosses the loanAmount threshold
      profit = newBalance - selectedLoanAccount.loanAmount;
    } else {
      // The entire transaction amount is profit
      profit = amount;
    }
  }

  selectedLoanAccount.paid = newBalance;

  const newBody = {
    ...body,
    profit
  };

  const newLoanTransaction = new LoanTransaction(newBody);

  await Promise.all([
    selectedLoanAccount.save(),
    newLoanTransaction.save(),
    loanReceiverBankCashHelper(payFrom, by, amount, date)
  ]);

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
  const payFrom = loanBody.payFrom;
  const by = loanBody.by;
  const amount = loanBody.totalAmount;
  delete loanBody.payFrom;
  const { error } = ngoLoanSchemaValidation.validate(loanBody);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const { durationInMonth, perInstallment, date } = loanBody;
  const tDate = date;
  delete loanBody.date;
  const newLoanAccount = await NgoLoan.create(loanBody);
  let transaction = {
    ngoLoanId: newLoanAccount._id,
    amount: perInstallment,
    date: null,
    status: 'unpaid'
  };
  let transactions = [];
  let startDate = moment(tDate);
  for (let i = 1; i <= durationInMonth; i++) { // Start from 1 to add 1 month for the first transaction
    let newTransaction = { ...transaction };
    newTransaction.date = startDate.clone().add(i, 'months').toISOString();
    transactions.push(newTransaction);
  }
  await ngoLoanReceiverCashHelper(payFrom, by, amount, date);
  await NgoLoanTransaction.insertMany(transactions);

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

  let date = body.date;
  let by = body.by;
  let payFrom = body.payFrom;
  delete body.date;
  delete body.payFrom;
  const { ngoLoanId, transactionId, amount } = body;
  if (!ngoLoanId || !transactionId) {
    return res.status(404).json({ message: "All fields are required" });
  }
  const ngoLoanAccount = await NgoLoan.findOne({ _id: ngoLoanId });
  ngoLoanAccount.totalPaid += amount;
  let loanAmount = ngoLoanAccount.amount;
  let totalAmount = ngoLoanAccount.totalAmount;
  let interestAmount = totalAmount - loanAmount;
  let expense = interestAmount / ngoLoanAccount.durationInMonth;
  console.log(expense);
  await ngoLoanAccount.save();
  const newTransaction = await NgoLoanTransaction.findOne({ _id: transactionId });
  newTransaction.status = "paid";
  newTransaction.expense = expense;
  newTransaction.paidDate = date;
  newTransaction.by = by;
  await newTransaction.save();

  await savingAccountWithDrawCashHelper(payFrom, by, amount, date, "Ngo Loan");
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
const getPendingLoanAccountList = asyncHandler(async (req, res) => {
  const { samityId, branchId } = req.query;
  const depositAccountList = await LoanAccount.aggregate([
    {
      $match: {
        samityId: new mongoose.Types.ObjectId(samityId),
        branchId: new mongoose.Types.ObjectId(branchId),
        status: "pending",
      },
    },
    {
      $lookup: {
        from: "localusers",
        localField: "memberId",
        foreignField: "_id",
        as: "member",
      },
    }, {
      $unwind: "$member"
    },
    {
      $lookup: {
        from: "branches",
        localField: "branchId",
        foreignField: "_id",
        as: "branch"
      }
    },
    {
      $unwind: "$branch"
    },
    {
      $lookup: {
        from: "samities",
        localField: "samityId",
        foreignField: "_id",
        as: "samity"
      }
    },
    {
      $unwind: "$samity"
    },

    {
      $project: {
        _id: 1,
        phoneNumber: "$member.mobileNumber",
        name: "$member.name",
        branchName: "$branch.branchName",
        samityName: "$samity.samityName",
        paymentTerm: 1,
        profitPercentage: 1,
        loanAmount: 1,
      },
    },
  ])
  return res.json({ data: depositAccountList })
})
const acceptPendingLoanList = asyncHandler(async (req, res) => {
  const _id = req.params.id;
  const id = new mongoose.Types.ObjectId(_id);
  const { status } = req.query;
  const check = status === 'approved' || 'closed' || 'rejected' ? true : false;
  if (!check) {
    return res.json({ message: "Status type isn't valid" }).status(404);
  }
  try {
    if (status === "rejected") {
      try {
        await LoanAccount.findByIdAndDelete({ _id: id });
        return res.json({ message: "Loan Account Rejected." });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error rejecting Saving Account" });
      }
    } else {
      await LoanAccount.findByIdAndUpdate(
        { _id: id },
        { $set: { status: status } }
      );
      return res.json({ message: "Saving Account Approved." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error updating saving Account." });
  }

})
module.exports = {
  createNewLoanAccountController,
  searchLoanAccountController,
  getLoanAccountsByBranchAndSamityId,
  searchLoanAccountsTransactionsController,
  payLoanAccountController,
  countLoanProfitController,
  ngoLoanCreateController,
  ngoLoanPaymentDetailsByLoanIdController,
  ngoLoanPayController,
  getPendingLoanAccountList,
  ngoLoanPayListController,
  acceptPendingLoanList
};
