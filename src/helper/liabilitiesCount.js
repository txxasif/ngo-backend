const Asset = require("../model/AssetSchema");
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
  const result = await Expense.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: "$total" },
      },
    },
  ]);
  const result1 = await Purchase.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: "$totalPayment" },
      },
    },
  ]);
  let totalExpenses = 0;
  let totalPurchases = 0;
  if (result.length > 0) {
    totalExpenses = result[0].total;
  }
  if (result1.length > 0) {
    totalPurchases = result1[0].total;
  }

  console.log(totalExpenses, totalPurchases);
  //console.log(totalPurchases, totalExpenses);
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
async function sumBankAmount() {
  try {
    const result = await NgoLoan.aggregate([
      {
        $match: {
          institute: "bank",
        },
      },
      {
        $group: {
          _id: null,
          totalBankAmount: { $sum: "$amount" },
        },
      },
    ]);
    if (result.length > 0) {
      return result[0].totalBankAmount;
    } else {
      return 0; // Return 0 if no bank loans found
    }
  } catch (error) {
    console.error("Error occurred while summing bank amounts:", error);
    throw error; // Propagate error to the caller
  }
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
async function countDepreciationPrice() {
  const result = await Asset.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: "$depreciationPrice" },
      },
    },
  ]);
  let depreciationPrice = 0;
  console.log(depreciationPrice);
  if (result.length > 0) {
    depreciationPrice = result[0].total;
  }
  return depreciationPrice;
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
  let loanGiven = 0;
  let loanReceived = 0;
  if (result.length > 0) {
    loanGiven = result[0].given;
    loanReceived = result[0].received;
  }
  return loanGiven - loanReceived;
}
async function provisionForExpenseCount() {
  const result = await Employee.aggregate([
    {
      $group: {
        _id: null,
        result: { $sum: "$salaryDue" },
      },
    },
  ]);
  let total = 0;
  if (result.length > 0) {
    total = result[0].result;
  }
  return total;
}

async function countAllLiability() {
  let profit = await countProfit();
  let expense = await countExpenses();
  // *capitalFund
  let capitalFund = profit - expense;
  // !reserver Fund incomplete
  let reserveFund = await countBankAndDrawerCash();
  // *
  let ngoLoanReceived = await ngoLoanReceivedMoney();
  // *
  let totalDeposit = await totalDepositMoney();
  // *
  let financialBank = await sumBankAmount();
  // *
  let employeeSecurityFund = await employeeSecurityFundSum();
  // *
  let loanLossProvision = await countLoanLossProvision();
  let depreciationPrice = await countDepreciationPrice();
  let provisionForExpense = await provisionForExpenseCount();
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
