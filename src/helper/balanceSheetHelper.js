const {
    ngoLoanReceivedMoneyHelper,
    dpsAccountHelper,
    fdrAccountHelper,
    getDrawerCashHelper,
    memberSavingsAccountHelper,
    bankCashHelper,
    employeeSecurityFundHelper,
    sumTotalAmountMinusPaid,
    assetHelper

} = require("./reportHepler");
async function generateBalanceSheet() {
    const [
        drawerCash,
        bankCash,
        loanInField,
        employeeSecurityFund,
        memberSavingsAccount,
        fdrAccount,
        dpsAccount,
        ngoLoanReceived,
        assets
    ] = await Promise.all([
        getDrawerCashHelper(),
        bankCashHelper(),
        sumTotalAmountMinusPaid(),
        employeeSecurityFundHelper(),
        memberSavingsAccountHelper(),
        fdrAccountHelper(),
        dpsAccountHelper(),
        ngoLoanReceivedMoneyHelper(),
        assetHelper()
    ]);

    const totalAssets = drawerCash + bankCash + loanInField + assets.reduce((sum, asset) => sum + asset.totalSum, 0);
    const totalLiabilitiesAndEquity = employeeSecurityFund + memberSavingsAccount + fdrAccount + dpsAccount + ngoLoanReceived;

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
            total: totalLiabilitiesAndEquity
        }
    };
}
module.exports = {
    generateBalanceSheet
}