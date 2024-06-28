const BankCash = require("../model/BankCashCash");
const Bank = require("../model/BankSchema");
const DrawerCash = require("../model/DrawerCashSchema");
const Samity = require("../model/SamitySchema");

/**
 * Handles the cash transaction for loan disbursement
 * @param {Object} payFrom - The source of the loan amount (drawer or bank)
 * @param {string} openedBy - The ID of the user opening the loan
 * @param {number} loanAmount - The amount of the loan
 * @param {string} branchId - The ID of the branch
 * @param {Date} openingDate - The date of loan opening
 */
async function loanDrawerBankCashHelper(payFrom, openedBy, loanAmount, branchId, openingDate) {
    const { _id, type } = payFrom;

    if (type === "drawer") {
        // Handle drawer cash transaction
        const samity = await Samity.findOne({ _id: _id });
        samity.drawerCash -= Number(loanAmount);

        const drawerCashBody = {
            amount: Number(loanAmount),
            branchId: branchId,
            samityId: _id,
            type: 'cashOut',
            transactionDetails: {
                date: openingDate,
                sourceDetails: "Loan Opening",
                by: openedBy
            }
        }

        const newDrawerCash = new DrawerCash(drawerCashBody);
        await Promise.all([await samity.save(), await newDrawerCash.save()])
    } else {
        // Handle bank cash transaction
        const selectedBank = await Bank.findOne({
            _id: _id
        });
        selectedBank.balance -= Number(loanAmount);

        const bankCashBody = {
            amount: Number(loanAmount),
            bankId: _id,
            type: 'cashOut',
            transactionDetails: {
                date: openingDate,
                sourceDetails: "Loan Opening",
                by: openedBy
            }
        }

        const newBankCash = new BankCash(bankCashBody);
        await Promise.all([selectedBank.save(), newBankCash.save()]);
    }
}

/**
 * Handles the cash transaction for loan repayment
 * @param {Object} payFrom - The destination of the repayment (drawer or bank)
 * @param {string} by - The ID of the user processing the repayment
 * @param {number} amount - The amount of the repayment
 * @param {Date} date - The date of the repayment
 */
async function loanReceiverBankCashHelper(payFrom, by, amount, date) {
    const { _id, type } = payFrom;

    if (type === "drawer") {
        // Handle drawer cash transaction
        const samity = await Samity.findOne({ _id: _id });
        samity.drawerCash += Number(amount);

        const drawerCashBody = {
            amount: Number(amount),
            branchId: samity.branchId,
            samityId: _id,
            type: 'cashIn',
            transactionDetails: {
                date: date,
                sourceDetails: "Loan Payment Received",
                by: by
            }
        }
        const newDrawerCash = new DrawerCash(drawerCashBody);
        await Promise.all([await samity.save(), await newDrawerCash.save()])
    } else {
        // Handle bank cash transaction
        const selectedBank = await Bank.findOne({
            _id: _id
        });
        selectedBank.balance += Number(amount);

        const bankCashBody = {
            amount: Number(amount),
            bankId: _id,
            type: 'cashIn',
            transactionDetails: {
                date: date,
                sourceDetails: "Loan Payment Received",
                by: by
            }
        }

        const newBankCash = new BankCash(bankCashBody);
        await Promise.all([selectedBank.save(), newBankCash.save()]);
    }
}
async function savingAccountDepositCashHelper(payFrom, by, amount, date, text) {
    const { _id, type } = payFrom;
    if (type === "drawer") {
        // Handle drawer cash transaction
        const samity = await Samity.findOne({ _id: _id });
        samity.drawerCash += Number(amount);

        const drawerCashBody = {
            amount: Number(amount),
            branchId: samity.branchId,
            samityId: _id,
            type: 'cashIn',
            transactionDetails: {
                date: date,
                sourceDetails: `${text} Account Installment`,
                by: by
            }
        }
        const newDrawerCash = new DrawerCash(drawerCashBody);
        await Promise.all([await samity.save(), await newDrawerCash.save()])
    } else {
        // Handle bank cash transaction
        const selectedBank = await Bank.findOne({
            _id: _id
        });
        selectedBank.balance += Number(amount);

        const bankCashBody = {
            amount: Number(amount),
            bankId: _id,
            type: 'cashIn',
            transactionDetails: {
                date: date,
                sourceDetails: `${text} Account Installment`,
                by: by
            }
        }

        const newBankCash = new BankCash(bankCashBody);
        await Promise.all([selectedBank.save(), newBankCash.save()]);
    }
}
async function savingAccountWithDrawCashHelper(payFrom, by, amount, date, text) {
    const { _id, type } = payFrom;
    console.log(text);
    console.log(payFrom);
    if (type === "drawer") {
        // Handle drawer cash transaction
        const samity = await Samity.findOne({ _id: _id });
        samity.drawerCash -= Number(amount);

        const drawerCashBody = {
            amount: Number(amount),
            branchId: samity.branchId,
            samityId: _id,
            type: 'cashOut',
            transactionDetails: {
                date: date,
                sourceDetails: `${text} Withdrawal`,
                by: by
            }
        }
        const newDrawerCash = new DrawerCash(drawerCashBody);
        await Promise.all([await samity.save(), await newDrawerCash.save()])
    } else {
        // Handle bank cash transaction
        const selectedBank = await Bank.findOne({
            _id: _id
        });
        selectedBank.balance -= Number(amount);

        const bankCashBody = {
            amount: Number(amount),
            bankId: _id,
            type: 'cashOut',
            transactionDetails: {
                date: date,
                sourceDetails: `${text}  Withdrawal`,
                by: by
            }
        }

        const newBankCash = new BankCash(bankCashBody);
        await Promise.all([selectedBank.save(), newBankCash.save()]);
    }
}

async function fdrAccountOpeningCashHelper(payFrom, by, amount, date) {
    const { _id, type } = payFrom;
    if (type === "drawer") {
        // Handle drawer cash transaction
        const samity = await Samity.findOne({ _id: _id });
        samity.drawerCash += Number(amount);

        const drawerCashBody = {
            amount: Number(amount),
            branchId: samity.branchId,
            samityId: _id,
            type: 'cashIn',
            transactionDetails: {
                date: date,
                sourceDetails: "FDR Account Installment",
                by: by
            }
        }
        const newDrawerCash = new DrawerCash(drawerCashBody);
        await Promise.all([samity.save(), newDrawerCash.save()])
    } else {
        // Handle bank cash transaction
        const selectedBank = await Bank.findOne({
            _id: _id
        });
        selectedBank.balance += Number(amount);

        const bankCashBody = {
            amount: Number(amount),
            bankId: _id,
            type: 'cashIn',
            transactionDetails: {
                date: date,
                sourceDetails: "FDR Account Installment",
                by: by
            }
        }

        const newBankCash = new BankCash(bankCashBody);
        await Promise.all([selectedBank.save(), newBankCash.save()]);
    }
}
async function fdrAccountWithdrawCashHelper(payFrom, by, amount, date) {
    const { _id, type } = payFrom;
    if (type === "drawer") {
        // Handle drawer cash transaction
        const samity = await Samity.findOne({ _id: _id });
        samity.drawerCash -= Number(amount);

        const drawerCashBody = {
            amount: Number(amount),
            branchId: samity.branchId,
            samityId: _id,
            type: 'cashOut',
            transactionDetails: {
                date: date,
                sourceDetails: "FDR Account Withdraw",
                by: by
            }
        }
        const newDrawerCash = new DrawerCash(drawerCashBody);
        await Promise.all([samity.save(), newDrawerCash.save()])
    } else {
        // Handle bank cash transaction
        const selectedBank = await Bank.findOne({
            _id: _id
        });
        selectedBank.balance -= Number(amount);

        const bankCashBody = {
            amount: Number(amount),
            bankId: _id,
            type: 'cashOut',
            transactionDetails: {
                date: date,
                sourceDetails: "FDR Account Withdraw",
                by: by
            }
        }

        const newBankCash = new BankCash(bankCashBody);
        await Promise.all([selectedBank.save(), newBankCash.save()]);
    }
}


module.exports = { fdrAccountWithdrawCashHelper, fdrAccountOpeningCashHelper, savingAccountWithDrawCashHelper, savingAccountDepositCashHelper, loanDrawerBankCashHelper, loanReceiverBankCashHelper }