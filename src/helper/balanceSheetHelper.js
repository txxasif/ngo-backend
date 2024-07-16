const incomeVsExpenseHelper = require("./incomeVsExpenseHelper");
const {
    ngoLoanReceivedMoneyHelper,
    dpsAccountHelper,
    fdrAccountHelper,
    getDrawerCashHelper,
    memberSavingsAccountHelper,
    bankCashHelper,
    employeeSecurityFundHelper,
    assetHelper,
    initialCapitalHelper,
    incomeHelper,
    loanInFieldHelper,
    donationHelper
} = require("./reportHepler");

async function generateBalanceSheet(from, to) {
    const [
        drawerCash,
        bankCash,
        loanInField,
        employeeSecurityFund,
        memberSavingsAccount,
        fdrAccount,
        dpsAccount,
        ngoLoanReceived,
        assets,
        initialCapital,
        incomeVsExpense,
        donation
    ] = await Promise.all([
        getDrawerCashHelper(),
        bankCashHelper(),
        loanInFieldHelper(),
        employeeSecurityFundHelper(),
        memberSavingsAccountHelper(),
        fdrAccountHelper(),
        dpsAccountHelper(),
        ngoLoanReceivedMoneyHelper(),
        assetHelper(from, to),
        initialCapitalHelper(from, to),
        incomeVsExpenseHelper(from, to),
        donationHelper(from, to)
    ]);
    const equity = {
        initialCapital: initialCapital,
        donatedCapital: donation.reduce((sum, item) => sum + item.amount, 0),
        retainedEarnings: incomeVsExpense.netIncome
    };
    const newEquity = donation.map((donation) => ({ name: `${donation.name} (Donation)`, amount: donation.amount }));
    const totalAssets = drawerCash + bankCash + loanInField + assets.reduce((sum, asset) => sum + asset.totalSum, 0);
    const totalEquity = equity.initialCapital + equity.donatedCapital + Math.abs(equity.retainedEarnings);

    const totalLiabilitiesAndEquity = employeeSecurityFund + memberSavingsAccount + fdrAccount + dpsAccount + ngoLoanReceived + totalEquity;

    return {
        assets: {
            currentAssets: [
                { name: "Cash in Hand", amount: drawerCash },
                { name: "Cash at Bank", amount: bankCash },
                { name: "Loans Receivable", amount: loanInField }
            ],
            fixedAssets: assets.map(asset => ({ name: asset.headName, amount: asset.totalSum })),
            total: totalAssets
        },
        liabilitiesAndEquity: {
            currentLiabilities: [
                { name: "Member Savings Accounts", amount: memberSavingsAccount },
                { name: "DPS Accounts", amount: dpsAccount },
                { name: "FDR Accounts", amount: fdrAccount },
                { name: "Employee Security Fund", amount: employeeSecurityFund },
                { name: "NGO Loan", amount: ngoLoanReceived }
            ],
            equity: [
                { name: "Initial Capital", amount: equity.initialCapital },
                { name: "Retained Earnings", amount: equity.retainedEarnings },
                ...newEquity

            ],
            total: totalLiabilitiesAndEquity
        },
    };
}

module.exports = {
    generateBalanceSheet
};