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
        income
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
        incomeHelper(from, to)
    ]);

    const equity = {
        initialCapital: initialCapital,
        donatedCapital: income.reduce((sum, item) => sum + item.totalSum, 0),
        retainedEarnings: incomeVsExpense.netIncome < 0 ? incomeVsExpense.netIncome : 0
    };

    const totalAssets = drawerCash + bankCash + loanInField + assets.reduce((sum, asset) => sum + asset.totalSum, 0);
    const totalEquity = equity.initialCapital + equity.donatedCapital + equity.retainedEarnings;

    const totalLiabilitiesAndEquity = employeeSecurityFund + memberSavingsAccount + fdrAccount + dpsAccount + ngoLoanReceived + totalEquity;
    console.log(totalLiabilitiesAndEquity);

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
                { name: "Donated Capital", amount: equity.donatedCapital },
                { name: "Retained Earnings", amount: equity.retainedEarnings }
            ],
            total: totalLiabilitiesAndEquity
        },
    };
}

module.exports = {
    generateBalanceSheet
};