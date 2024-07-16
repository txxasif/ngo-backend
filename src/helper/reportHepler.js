const Asset = require("../model/AssetSchema");
const Bank = require("../model/BankSchema");
const { DpsAccount, DpsAccountWithdraw } = require("../model/DpsAccountSchema");
const Employee = require("../model/EmployeeSchema");
const Expense = require("../model/ExpenseSchema");
const { FdrAccount, TransactionFdr } = require("../model/FdrAccountSchema");
const { LoanAccount, LoanTransaction } = require("../model/LoanAccountSchema");
const LocalUser = require("../model/LocalUserSchema");
const { NgoLoan, NgoLoanTransaction } = require("../model/NgoLoanSchema");
const PaySlip = require("../model/PaySlipSchema");
const Samity = require("../model/SamitySchema");
const { SavingsAccount, SavingsAccountTransaction, SavingsAccountWithdraw } = require("../model/SavingAccountsScehma");
const IncomeHeadTransaction = require("../model/IncomeHeadTransactionSchema");
const DrawerCash = require("../model/DrawerCashSchema");
const BankCash = require("../model/BankCashCash");
const Donation = require("../model/DonationSchema");

async function getDrawerCashHelper() {
    const result = await Samity.aggregate([
        {
            $group: { _id: null, total: { $sum: "$drawerCash" } },
        },
    ]);
    const totalDrawerCash = result[0]?.total || 0;
    return totalDrawerCash;
}
async function bankCashHelper() {
    const result = await Bank.aggregate([
        {
            $group: { _id: null, total: { $sum: "$balance" } },
        },
    ]);
    const totalBankCash = result[0]?.total || 0;
    return totalBankCash;
}
async function loanInFieldHelper() {
    const result = await LoanAccount.aggregate([
        {
            $project: {
                difference: {
                    $cond: {
                        if: { $lt: [{ $subtract: ["$totalAmount", "$paid"] }, 0] },
                        then: 0,
                        else: { $subtract: ["$totalAmount", "$paid"] },
                    },
                },
            },
        },
        {
            $group: {
                _id: null,
                totalDifference: { $sum: "$difference" },
            },
        },
    ]);

    const totalDifference = result[0]?.totalDifference || 0;
    return totalDifference;
}
async function employeeSecurityFundHelper() {
    const result = await Employee.aggregate([
        {
            $group: {
                _id: null,
                total: { $sum: "$presentPosition.employeeSecurityFund" },
            },
        },
    ]);
    const totalEmployeeSecurityFund = result[0]?.total || 0;
    return totalEmployeeSecurityFund;
}
async function memberSavingsAccountHelper() {
    const result = await SavingsAccount.aggregate([
        {
            $group: { _id: null, total: { $sum: "$balance" } },
        },
    ]);
    const totalMemberSavingsAccount = result[0]?.total || 0;
    return totalMemberSavingsAccount;
}
async function fdrAccountHelper() {
    const result = await FdrAccount.aggregate([
        {
            $group: { _id: null, total: { $sum: "$amount" } },
        },
    ]);
    const totalFdrAccount = result[0]?.total || 0;
    return totalFdrAccount;
}
async function dpsAccountHelper() {
    const result = await DpsAccount.aggregate([
        {
            $group: { _id: null, total: { $sum: "$balance" } },
        },
    ]);
    const totalDpsAccount = result[0]?.total || 0;
    return totalDpsAccount;
}
async function ngoLoanReceivedMoneyHelper() {
    const result = await NgoLoan.aggregate([
        {
            $project: {
                difference: {
                    $cond: {
                        if: { $lt: [{ $subtract: ["$totalAmount", "$totalPaid"] }, 0] },
                        then: 0,
                        else: { $subtract: ["$totalAmount", "$totalPaid"] },
                    },
                },
            },
        },
        {
            $group: {
                _id: null,
                totalDifference: { $sum: "$difference" },
            },
        },
    ]);

    const totalDifference = result[0]?.totalDifference || 0;
    return totalDifference;
}
async function assetHelper() {
    const result = await Asset.aggregate([
        {
            $lookup: {
                from: "assetheads", // the name of the collection in the database
                localField: "headId",
                foreignField: "_id",
                as: "headDetails",
            },
        },
        {
            $unwind: "$headDetails",
        },
        {
            $group: {
                _id: "$headId",
                headName: { $first: "$headDetails.name" },
                totalSum: { $sum: "$total" },
            },
        },
        {
            $project: {
                headName: 1,
                totalSum: 1,
            },
        },
    ]);

    return result;
}
// !Income Vs Expense
// !Income
async function userFromAndMemberShipFeeHelper(fromDate, toDate) {
    const result = await LocalUser.aggregate([
        {
            $match: {
                openingDate: {
                    $gte: new Date(fromDate),
                    $lte: new Date(toDate),
                },
            },
        },
        {
            $group: {
                _id: null,
                totalMembershipFee: { $sum: "$membershipFee" },
                totalFormFee: { $sum: "$formFee" },
            },
        },
    ]);

    const totalMembershipFee = result[0]?.totalMembershipFee || 0;
    const totalFormFee = result[0]?.totalFormFee || 0;

    return totalMembershipFee + totalFormFee;
}
async function loanInterestHelper(fromDate, toDate) {
    const result = await LoanTransaction.aggregate([
        {
            $match: {
                date: {
                    $gte: new Date(fromDate),
                    $lte: new Date(toDate),
                },
            },
        },
        {
            $group: {
                _id: null,
                profit: { $sum: "$profit" },
            },
        },
    ]);
    const profit = result[0]?.profit || 0;
    return profit;
}
// !Expense
async function salaryPostingHelper(fromDate, toDate) {
    const result = await PaySlip.aggregate([
        {
            $match: {
                date: {
                    $gte: new Date(fromDate),
                    $lte: new Date(toDate),
                },
            },
        },
        {
            $group: {
                _id: null,
                total: { $sum: "$totalPaid" },
            },
        },
    ]);
    const total = result[0]?.total || 0;
    return total;
}
async function expenseHelper(from, to) {
    console.log("asif");
    const result = await Expense.aggregate([
        {
            $match: {
                date: {
                    $gte: new Date(from),
                    $lte: new Date(to),
                },
            },
        },
        {
            $group: {
                _id: "$headId",
                headName: { $first: "$headDetails.name" }, // Assuming you want to include headName
                totalSum: { $sum: "$amount" },
            },
        },
        {
            $lookup: {
                from: "expenseheads", // Adjust based on your collection name
                localField: "_id",
                foreignField: "_id",
                as: "headDetails",
            },
        },
        {
            $unwind: "$headDetails",
        },
        {
            $project: {
                headName: "$headDetails.name", // Extract headName from headDetails
                totalSum: 1,
            },
        },
    ]);
    console.log(result, 'expensse========');
    return result;
}

async function incomeHelper(from, to) {
    const result = await IncomeHeadTransaction.aggregate([
        {
            $match: {
                date: {
                    $gte: new Date(from),
                    $lte: new Date(to),
                },
            },
        },
        {
            $group: {
                _id: "$headId",
                headName: { $first: "$headDetails.head" }, // Assuming you want to include headName
                totalSum: { $sum: "$amount" },
            },
        },
        {
            $lookup: {
                from: "incomeheads", // Adjust based on your collection name
                localField: "_id",
                foreignField: "_id",
                as: "headDetails",
            },
        },
        {
            $unwind: "$headDetails",
        },
        {
            $project: {
                _id: 0,
                headName: "$headDetails.head", // Extract headName from headDetails
                totalSum: 1,
            },
        },
    ]);

    return result;
}
async function savingsAccountExpenseHelper(from, to) {
    const result = await SavingsAccountWithdraw.aggregate([
        {
            $match: {
                date: {
                    $gte: new Date(from),
                    $lte: new Date(to)
                }
            }
        },
        {
            $group: {
                _id: null,
                totalExpense: { $sum: "$expense" }
            }
        },
        {
            $project: {
                _id: 0,
                totalExpense: 1
            }
        }
    ]);

    return result.length > 0 ? result[0].totalExpense : 0;
}
async function fdrAccountExpenseHelper(from, to) {
    const result = await TransactionFdr.aggregate([
        {
            $match: {
                date: {
                    $gte: new Date(from),
                    $lte: new Date(to)
                },
                capital: false,
                status: 'paid'
            }
        },
        {
            $group: {
                _id: null,
                totalAmount: { $sum: "$amount" }
            }
        },
        {
            $project: {
                _id: 0,
                totalAmount: 1
            }
        }
    ]);

    return result.length > 0 ? result[0].totalAmount : 0;
}
async function dpsAccountExpenseHelper(from, to) {
    const result = await DpsAccountWithdraw.aggregate([
        {
            $match: {
                date: {
                    $gte: new Date(from),
                    $lte: new Date(to)
                },
            }
        },
        {
            $group: {
                _id: null,
                totalAmount: { $sum: "$expense" }
            }
        },
        {
            $project: {
                _id: 0,
                totalAmount: 1
            }
        }
    ]);

    return result.length > 0 ? result[0].totalAmount : 0;
}
async function ngoLoanExpenseHelper(from, to) {
    const result = await NgoLoanTransaction.aggregate([
        {
            $match: {
                paidDate: {
                    $gte: new Date(from),
                    $lte: new Date(to)
                },
            }
        },
        {
            $group: {
                _id: null,
                totalAmount: { $sum: "$expense" }
            }
        },
        {
            $project: {
                _id: 0,
                totalAmount: 1
            }
        }
    ]);

    return result.length > 0 ? result[0].totalAmount : 0;
}
async function initialCapitalHelper(from, to) {

    const result = await DrawerCash.aggregate([
        {
            $match: {
                "transactionDetails.date": {
                    $gte: new Date(from),
                    $lte: new Date(to)
                },
                isCapital: true,
                type: "cashIn"
            }
        },
        {
            $group: {
                _id: null,
                totalCapital: { $sum: "$amount" }
            }
        },
        {
            $project: {
                _id: 0,
                totalCapital: 1
            }
        }
    ]);
    const result1 = await BankCash.aggregate([
        {
            $match: {
                "transactionDetails.date": {
                    $gte: new Date(from),
                    $lte: new Date(to)
                },
                isCapital: true,
                type: "cashIn"
            }
        },
        {
            $group: {
                _id: null,
                totalCapital: { $sum: "$amount" }
            }
        },
        {
            $project: {
                _id: 0,
                totalCapital: 1
            }
        }
    ]);
    const drawerCapital = result.length > 0 ? result[0].totalCapital : 0;
    const bankCapital = result1.length > 0 ? result1[0].totalCapital : 0;
    console.log(drawerCapital, bankCapital);
    return drawerCapital + bankCapital;
}
async function donationHelper(from, to) {
    const result = await Donation.aggregate([
        {
            $match: {
                date: {
                    $gte: new Date(from),
                    $lte: new Date(to)
                },
            }
        },
        {
            $project: {
                _id: 0,
                name: "$from",
                amount: 1
            }
        }
    ]);
    return result;
}

module.exports = {
    loanInFieldHelper,
    getDrawerCashHelper,
    bankCashHelper,
    employeeSecurityFundHelper,
    memberSavingsAccountHelper,
    fdrAccountHelper,
    dpsAccountHelper,
    ngoLoanReceivedMoneyHelper,
    userFromAndMemberShipFeeHelper,
    loanInterestHelper,
    salaryPostingHelper,
    expenseHelper,
    assetHelper,
    incomeHelper,
    savingsAccountExpenseHelper,
    fdrAccountExpenseHelper,
    dpsAccountExpenseHelper,
    ngoLoanExpenseHelper,
    initialCapitalHelper,
    donationHelper
};
