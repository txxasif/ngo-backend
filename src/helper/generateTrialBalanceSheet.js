const {
    getDrawerCashHelper,
    bankCashHelper,
    loanInFieldHelper,
    memberSavingsAccountHelper,
    fdrAccountExpenseHelper,
    dpsAccountExpenseHelper,
    fdrAccountHelper,
    dpsAccountHelper,
    employeeSecurityFundHelper,
    ngoLoanExpenseHelper,
    ngoLoanReceivedMoneyHelper,
    initialCapitalHelper,
    salaryPostingHelper,
    userFromAndMemberShipFeeHelper,
    assetHelper
} = require("./reportHepler");
const calculateExpenses = require("./incomeVsExpenseHelper");
async function generateTrialBalanceSheet(from, to) {
    const [
        drawerCash, bankCash,
        loanReceiveAble, savings,
        fdr, dps,
        employeeSecurityFund, ngoLoanReceived,
        initialCapital,
        expense, userFromAndMemberShipFee, assets

    ] = await Promise.all([
        getDrawerCashHelper(),
        bankCashHelper(),
        loanInFieldHelper(),
        memberSavingsAccountHelper(),
        fdrAccountHelper(),
        dpsAccountHelper(),
        employeeSecurityFundHelper(),
        ngoLoanReceivedMoneyHelper(),
        initialCapitalHelper(from, to),
        calculateExpenses(from, to),
        userFromAndMemberShipFeeHelper(from, to),
        assetHelper(),
    ]);
    return {
        drawerCash,
        bankCash,
        loanReceiveAble,
        savings,
        fdr,
        dps,
        employeeSecurityFund,
        ngoLoanReceived,
        initialCapital,
        userFromAndMemberShipFee,
        assets,
        expense: expense.expenses
    }

}
module.exports = generateTrialBalanceSheet;