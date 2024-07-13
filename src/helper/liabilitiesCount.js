
const { DepositAccount } = require("../model/DepositAccountSchema");
const Employee = require("../model/EmployeeSchema");
const Expense = require("../model/ExpenseSchema");
const { LoanAccount } = require("../model/LoanAccountSchema");
const LocalUser = require("../model/LocalUserSchema");
const { NgoLoan } = require("../model/NgoLoanSchema");
const Samity = require("../model/SamitySchema");
async function countProfit() {
  const loanAccountResult = LoanAccount.aggregate([
    {
      $project: {
        profit: {
          $cond: {
            if: { $gt: ["$paid", "$loanAmount"] },
            then: { $subtract: ["$paid", "$loanAmount"] },
            else: 0,
          },
        },
      },
    },
    {
      $group: {
        _id: null,
        totalProfit: { $sum: "$profit" },
      },
    },
  ]);

  const localUserResult = LocalUser.aggregate([
    {
      $group: {
        _id: null,
        totalMembershipFee: { $sum: "$membershipFee" },
      },
    },
  ]);

  const [loanAccountAggregation, localUserAggregation] = await Promise.all([
    loanAccountResult,
    localUserResult,
  ]);

  const totalProfit = loanAccountAggregation[0]?.totalProfit || 0;
  const membershipFee = localUserAggregation[0]?.totalMembershipFee || 0;
  console.log(totalProfit);

  return totalProfit + membershipFee;
}

async function countExpenses() {
  const [expenseResult, purchaseResult] = await Promise.all([
    Expense.aggregate([{ $group: { _id: null, total: { $sum: "$total" } } }]),
    Purchase.aggregate([
      { $group: { _id: null, total: { $sum: "$totalPayment" } } },
    ]),
  ]);

  const totalExpenses = expenseResult[0]?.total || 0;
  const totalPurchases = purchaseResult[0]?.total || 0;

  return totalExpenses + totalPurchases;
}

async function countBankAndDrawerCash() {
  const result = await Samity.aggregate([
    {
      $group: {
        _id: null,
        totalDrawerCash: { $sum: "$drawerCash" },
        totalBankCash: { $sum: "$bankCash" },
      },
    },
  ]);

  const totalDrawerCash = result[0]?.totalDrawerCash || 0;
  const totalBankCash = result[0]?.totalBankCash || 0;

  return totalBankCash + totalDrawerCash;
}

async function ngoLoanReceivedMoney() {
  const result = await NgoLoan.aggregate([
    { $group: { _id: null, totalReceivedMoney: { $sum: "$amount" } } },
  ]);

  return result[0]?.totalReceivedMoney || 0;
}

async function totalDepositMoney() {
  const result = await DepositAccount.aggregate([
    { $group: { _id: null, totalDeposit: { $sum: "$balance" } } },
  ]);

  return result[0]?.totalDeposit || 0;
}

async function sumBankAmount() {
  const result = await NgoLoan.aggregate([
    { $match: { institute: "bank" } },
    { $group: { _id: null, totalBankAmount: { $sum: "$amount" } } },
  ]);

  return result[0]?.totalBankAmount || 0;
}

async function employeeSecurityFundSum() {
  const result = await Employee.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: "$presentPosition.employeeSecurityFund" },
      },
    },
  ]);

  return result[0]?.total || 0;
}

async function countDepreciationPrice() {
  const result = await Asset.aggregate([
    { $group: { _id: null, total: { $sum: "$depreciationPrice" } } },
  ]);

  return result[0]?.total || 0;
}

async function countLoanLossProvision() {
  const result = await LoanAccount.aggregate([
    {
      $group: {
        _id: null,
        given: { $sum: "$loanAmount" },
        received: { $sum: "$paid" },
      },
    },
  ]);

  const loanGiven = result[0]?.given || 0;
  const loanReceived = result[0]?.received || 0;

  return loanGiven - loanReceived;
}

async function provisionForExpenseCount() {
  const result = await Employee.aggregate([
    { $group: { _id: null, result: { $sum: "$salaryDue" } } },
  ]);

  return result[0]?.result || 0;
}

async function countAllLiability() {
  const [
    profit,
    expense,
    reserveFund,
    ngoLoanReceived,
    totalDeposit,
    financialBank,
    employeeSecurityFund,
    loanLossProvision,
    depreciationPrice,
    provisionForExpense,
  ] = await Promise.all([
    countProfit(),
    countExpenses(),
    countBankAndDrawerCash(),
    ngoLoanReceivedMoney(),
    totalDepositMoney(),
    sumBankAmount(),
    employeeSecurityFundSum(),
    countLoanLossProvision(),
    countDepreciationPrice(),
    provisionForExpenseCount(),
  ]);

  const capitalFund = profit - expense;

  return {
    capitalFund,
    ngoLoanReceived,
    totalDeposit,
    employeeSecurityFund,
    financialBank,
    depreciationPrice,
    loanLossProvision,
    provisionForExpense,
  };
}

module.exports = {
  countAllLiability,
};
