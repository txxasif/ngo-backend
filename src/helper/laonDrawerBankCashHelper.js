const BankCash = require("../model/BankCashCash");
const Bank = require("../model/BankSchema");
const DrawerCash = require("../model/DrawerCashSchema");
const Samity = require("../model/SamitySchema");

async function loanDrawerBankCashHelper(payFrom, openedBy, loanAmount, branchId, openingDate) {
    const { _id, type } = payFrom;
    if (type === "drawer") {
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
        await Promise.all([await selectedBank.save(), await newBankCash.save()]);

    }

}
module.exports = { loanDrawerBankCashHelper }