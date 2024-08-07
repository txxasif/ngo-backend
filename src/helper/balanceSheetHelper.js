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
    loanInFieldHelper,
    donationHelper,
    expenseLiabilityHelper,
    liabilityAssetHelper
} = require("./reportHepler");
function getCommonHeadDetails(assetResult, liabilityResult) {


    // Create a map to store sums of headIds from liabilityResult
    const headSums = new Map();
    let total = 0;
    // Process liabilityResult
    liabilityResult.forEach(item => {
        if (!headSums.has(item._id.toString())) {
            total += item.totalSum;
            headSums.set(item._id.toString(), { headName: item.headName, totalSum: item.totalSum });
        } else {
            total += item.totalSum;
            headSums.get(item._id.toString()).totalSum += item.totalSum;
        }
    });

    // Process assetResult and find common headIds
    assetResult.forEach(item => {
        if (!headSums.has(item._id.toString())) {
            total += item.totalSum;
            headSums.set(item._id.toString(), { headName: item.headName, totalSum: item.totalSum });
        } else {
            total += item.totalSum;
            headSums.get(item._id.toString()).totalSum += item.totalSum;
        }
    });

    // Prepare the final result
    const commonHeadDetails = [];
    headSums.forEach((value, key) => {
        commonHeadDetails.push({
            name: value.headName,
            amount: value.totalSum
        });
    });
    console.log(total, 'total');

    return [commonHeadDetails, total];
}

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
        donation,
        expenseLiability,
        liabilityAsset

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
        donationHelper(from, to),
        expenseLiabilityHelper(from, to),
        liabilityAssetHelper()

    ]);


    const equity = {
        initialCapital: initialCapital,
        donatedCapital: donation.reduce((sum, item) => sum + item.amount, 0),
        retainedEarnings: incomeVsExpense.netIncome
    };
    const assetLiabilitySum = liabilityAsset.reduce((sum, asset) => sum + asset.totalSum, 0);
    const [finalAssets, total] = getCommonHeadDetails(assets, liabilityAsset);
    const newEquity = donation.map((donation) => ({ name: `${donation.name} (Donation)`, amount: donation.amount }));
    const totalAssets = drawerCash + bankCash + loanInField + total;
    const totalEquity = equity.initialCapital + equity.donatedCapital + Math.abs(equity.retainedEarnings);
    const totalLiabilitiesAndEquity = employeeSecurityFund + memberSavingsAccount + fdrAccount + dpsAccount + ngoLoanReceived + totalEquity + expenseLiability + assetLiabilitySum;





    return {
        assets: {
            currentAssets: [
                { name: "Cash in Hand", amount: drawerCash },
                { name: "Cash at Bank", amount: bankCash },
                { name: "Loans Receivable", amount: loanInField }
            ],
            fixedAssets: finalAssets,
            provisionOfExpenses: [
                { name: "Expenses", amount: expenseLiability },

            ],
            total: totalAssets + expenseLiability
        },
        liabilitiesAndEquity: {
            currentLiabilities: [
                { name: "Member Savings Accounts", amount: memberSavingsAccount },
                { name: "DPS Accounts", amount: dpsAccount },
                { name: "FDR Accounts", amount: fdrAccount },
                { name: "Employee Security Fund", amount: employeeSecurityFund },
                { name: "NGO Loan", amount: ngoLoanReceived },
                { name: "Expenses Liability", amount: expenseLiability },
                { name: "Assets Liability", amount: liabilityAsset.reduce((sum, asset) => sum + asset.totalSum, 0) }
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