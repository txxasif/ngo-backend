const { DepositAccount } = require("../model/DepositAccountSchema");
const Employee = require("../model/EmployeeSchema");
const Expense = require("../model/ExpenseSchema");
const { LoanAccount } = require("../model/LoanAccountSchema");
const LocalUser = require("../model/LocalUserSchema");
const { NgoLoan } = require("../model/NgoLoanSchema");
const Purchase = require("../model/purchaseSchema");
const Samity = require("../model/SamitySchema");
async function countProfit() {
  const loanAccounts = await LoanAccount.find({}).lean();

  let totalProfit = 0;
  for (let i = 0; i < loanAccounts.length; i++) {
    if (loanAccounts[i].paid > loanAccounts[i].loanAmount) {
      totalProfit += loanAccounts[i].paid - loanAccounts[i].loanAmount;
    }
  }
  const localUsers = await LocalUser.find({}).lean();
  let membershipFee = 0;

  for (let i = 0; i < localUsers.length; i++) {
    membershipFee += localUsers[i].membershipFee;
  }
  return totalProfit + membershipFee;
}
async function countExpenses() {
  const expense = await Expense.find({}).lean();
  const purchase = await Purchase.find({}).lean();
  let totalExpenses = 0;
  let totalPurchases = 0;
  for (let i = 0; i < purchase.length; i++) {
    totalExpenses += purchase[i].totalPayment;
  }
  for (let j = 0; j < expense.length; j++) {
    totalPurchases += expense[j].total;
  }
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
  let totalDrawerCash = 0;
  let totalBankCash = 0;
  if (result.length > 0) {
    totalDrawerCash = result[0].totalDrawerCash;
    totalBankCash = result[0].totalBankCash;
  }
  let total = totalBankCash + totalDrawerCash;
  return total;
}
async function ngoLoanReceivedMoney() {
  const result = await NgoLoan.aggregate([
    {
      $group: {
        _id: null,
        totalReceivedMoney: { $sum: "$amount" },
      },
    },
  ]);
  let totalReceivedMoney = 0;
  if (result.length > 0) {
    totalReceivedMoney = result[0].totalReceivedMoney;
  }
  return totalReceivedMoney;
}
async function totalDepositMoney() {
  const result = await DepositAccount.aggregate([
    {
      $group: {
        _id: null,
        totalDeposit: { $sum: "$amount" },
      },
    },
  ]);
  let totalDeposit = 0;
  if (result.length > 0) {
    totalDeposit = result[0].totalDeposit;
  }
  return totalDeposit;
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
  let employeeFund = 0;
  if (result.length > 0) {
    employeeFund = result[0].total;
  }
  return employeeFund;
}
async function countAllLiability() {
  let profit = await countProfit();
  let expense = await countExpenses();
  let bankAndDrawerCash = await countBankAndDrawerCash();
  let ngoLoanReceived = await ngoLoanReceivedMoney();
  let totalDeposit = await totalDepositMoney();
  let employeeSecurityFund = await employeeSecurityFundSum();

  return {
    profit,
    expense,
    bankAndDrawerCash,
    ngoLoanReceived,
    totalDeposit,
    employeeSecurityFund,
  };
}

module.exports = {
  countAllLiability,
};
