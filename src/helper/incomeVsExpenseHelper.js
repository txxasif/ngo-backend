const {
    assetHelper,
    expenseHelper,
    userFromAndMemberShipFeeHelper,
    loanInterestHelper,
    salaryPostingHelper,
    incomeHelper,
    savingsAccountExpenseHelper,
    fdrAccountExpenseHelper,
    dpsAccountExpenseHelper,
    ngoLoanExpenseHelper
} = require("./reportHepler");
async function incomeVsExpenseHelper(from, to) {
    const [membershipFee, loanInterest, salaries, expenses, assets, incomes, savingsExpense, fdrExpense, dpsExpense, ngoLoanExpense] = await Promise.all([
        userFromAndMemberShipFeeHelper(from, to),
        loanInterestHelper(from, to),
        salaryPostingHelper(from, to),
        expenseHelper(from, to),
        assetHelper(from, to),
        incomeHelper(from, to),
        savingsAccountExpenseHelper(from, to),
        fdrAccountExpenseHelper(from, to),
        dpsAccountExpenseHelper(from, to),
        ngoLoanExpenseHelper(from, to)
    ]);

    // Structure income with initial fixed items
    const income = {
        "Membership and Form Fees": membershipFee,
        "Interest Income on Loans": loanInterest,
    };

    // Add dynamic incomes to the income object
    incomes.forEach(item => {
        income[item.headName] = (income[item.headName] || 0) + item.totalSum;
    });

    const totalIncome = Object.values(income).reduce((sum, value) => sum + value, 0);

    // Structure expenses, including assets
    const expenseItems = [
        { name: "Salaries Expense", amount: salaries },
        { name: "Savings Interest Expense", amount: savingsExpense },
        { name: "FDR Interest Expense", amount: fdrExpense },
        { name: "DPS Interest Expense", amount: dpsExpense },
        { name: "Ngo Loan Interest Expense", amount: ngoLoanExpense },
        ...expenses.map(e => ({ name: e.headName, amount: e.totalSum })),
        ...assets.map(a => ({ name: a.headName, amount: a.totalSum })),


        // Add other specific expenses if available
    ];

    const totalExpenses = expenseItems.reduce((sum, item) => sum + item.amount, 0);

    const netIncome = totalIncome - totalExpenses;

    return {
        income: {
            items: income,
            total: totalIncome
        },
        expenses: {
            items: expenseItems,
            total: totalExpenses
        },
        netIncome: netIncome
    };
}

module.exports = incomeVsExpenseHelper;
