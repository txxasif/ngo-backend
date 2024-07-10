const Asset = require("../model/AssetSchema");
const Bank = require("../model/BankSchema");
const { DpsAccount } = require("../model/DpsAccountSchema");
const Employee = require("../model/EmployeeSchema");
const { FdrAccount } = require("../model/FdrAccountSchema");
const { LoanAccount, LoanTransaction } = require("../model/LoanAccountSchema");
const LocalUser = require("../model/LocalUserSchema");
const { NgoLoan } = require("../model/NgoLoanSchema");
const Samity = require("../model/SamitySchema");
const { SavingsAccount } = require("../model/SavingAccountsScehma");
async function getDrawerCashHelper() {
    const result = await Samity.aggregate([
        {
            $group: { _id: null, total: { $sum: "$drawerCash" } }
        }
    ])
    const totalDrawerCash = result[0]?.total || 0;
    return totalDrawerCash
}
async function bankCashHelper() {
    const result = await Bank.aggregate([
        {
            $group: { _id: null, total: { $sum: "$balance" } }
        }
    ])
    const totalBankCash = result[0]?.total || 0;
    return totalBankCash
}
async function sumTotalAmountMinusPaid() {
    const result = await LoanAccount.aggregate([
        {
            $project: {
                difference: {
                    $cond: {
                        if: { $lt: [{ $subtract: ["$totalAmount", "$paid"] }, 0] },
                        then: 0,
                        else: { $subtract: ["$totalAmount", "$paid"] }
                    }
                }
            }
        },
        {
            $group: {
                _id: null,
                totalDifference: { $sum: "$difference" }
            }
        }
    ]);

    const totalDifference = result[0]?.totalDifference || 0;
    return totalDifference;
}
async function employeeSecurityFundHelper() {
    const result = await Employee.aggregate([
        {
            $group: { _id: null, total: { $sum: "$presentPosition.employeeSecurityFund" } }
        }
    ])
    const totalEmployeeSecurityFund = result[0]?.total || 0;
    return totalEmployeeSecurityFund
}
async function memberSavingsAccountHelper() {
    const result = await SavingsAccount.aggregate([
        {
            $group: { _id: null, total: { $sum: "$balance" } }
        }
    ])
    const totalMemberSavingsAccount = result[0]?.total || 0;
    return totalMemberSavingsAccount
}
async function fdrAccountHelper() {
    const result = await FdrAccount.aggregate([
        {
            $group: { _id: null, total: { $sum: "$balance" } }
        }
    ])
    const totalFdrAccount = result[0]?.total || 0;
    return totalFdrAccount
}
async function dpsAccountHelper() {
    const result = await DpsAccount.aggregate([
        {
            $group: { _id: null, total: { $sum: "$balance" } }
        }
    ])
    const totalDpsAccount = result[0]?.total || 0;
    return totalDpsAccount
}
async function ngoLoanReceivedMoneyHelper() {
    const result = await NgoLoan.aggregate([
        {
            $project: {
                difference: {
                    $cond: {
                        if: { $lt: [{ $subtract: ["$totalAmount", "$totalPaid"] }, 0] },
                        then: 0,
                        else: { $subtract: ["$totalAmount", "$totalPaid"] }
                    }
                }
            }
        },
        {
            $group: {
                _id: null,
                totalDifference: { $sum: "$difference" }
            }
        }
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
                as: "headDetails"
            }
        },
        {
            $unwind: "$headDetails"
        },
        {
            $group: {
                _id: "$headId",
                headName: { $first: "$headDetails.name" },
                totalSum: { $sum: "$total" }
            }
        },
        {
            $project: {

                headName: 1,
                totalSum: 1
            }
        }
    ]);

    return result;
}
// !Income Vs Expense
async function userFromAndMemberShipFeeHelper(fromDate, toDate) {
    const result = await LocalUser.aggregate([
        {
            $match: {
                openingDate: {
                    $gte: new Date(fromDate),
                    $lte: new Date(toDate)
                }
            }
        },
        {
            $group: {
                _id: null,
                totalMembershipFee: { $sum: "$membershipFee" },
                totalFormFee: { $sum: "$formFee" }
            }
        }
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
                    $lte: new Date(toDate)
                }
            }
        },
        {
            $group: {
                _id: null,
                profit: { $sum: "$profit" },

            }
        }
    ]);
    const profit = result[0]?.profit || 0;
    return profit;
}
module.exports = {
    sumTotalAmountMinusPaid,
    getDrawerCashHelper,
    bankCashHelper,
    employeeSecurityFundHelper,
    memberSavingsAccountHelper,
    fdrAccountHelper,
    dpsAccountHelper,
    ngoLoanReceivedMoneyHelper,
    assetHelper,
    userFromAndMemberShipFeeHelper,
    loanInterestHelper
}
