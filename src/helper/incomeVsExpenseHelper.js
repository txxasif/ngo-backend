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

async function calculateIncome(from, to) {
    const [membershipFee, loanInterest, incomes] = await Promise.all([
        userFromAndMemberShipFeeHelper(from, to),
        loanInterestHelper(from, to),
        incomeHelper(from, to)
    ]);
    const newIncome = {};
    incomes.forEach(element => {
        newIncome[element.headName] = (element.totalSum || 0)
    });
    const income = {
        "Membership and Form Fees": membershipFee,
        "Interest Income on Loans": loanInterest,
        ...newIncome

    };



    const totalIncome = Object.values(income).reduce((sum, value) => sum + value, 0);
    console.log(totalIncome);
    return {
        items: income,
        total: totalIncome
    };
}

async function calculateExpenses(from, to) {
    const [salaries, expenses, assets, savingsExpense, fdrExpense, dpsExpense, ngoLoanExpense] = await Promise.all([
        salaryPostingHelper(from, to),
        expenseHelper(from, to),
        assetHelper(from, to),
        savingsAccountExpenseHelper(from, to),
        fdrAccountExpenseHelper(from, to),
        dpsAccountExpenseHelper(from, to),
        ngoLoanExpenseHelper(from, to)
    ]);

    const expenseItems = [
        { name: "Salaries Expense", amount: salaries },
        { name: "Savings Interest Expense", amount: savingsExpense },
        { name: "FDR Interest Expense", amount: fdrExpense },
        { name: "DPS Interest Expense", amount: dpsExpense },
        { name: "Ngo Loan Interest Expense", amount: ngoLoanExpense },
        ...expenses.map(e => ({ name: e.headName, amount: e.totalSum })),

    ];

    const totalExpenses = expenseItems.reduce((sum, item) => sum + item.amount, 0);

    return {
        items: expenseItems,
        total: totalExpenses
    };
}

async function incomeVsExpenseHelper(from, to) {
    const [income, expenses] = await Promise.all([
        calculateIncome(from, to),
        calculateExpenses(from, to)
    ]);

    const netIncome = income.total - expenses.total;

    return {
        income: income,
        expenses: expenses,
        netIncome: netIncome
    };
}

module.exports = incomeVsExpenseHelper, {

    calculateIncome,
    calculateExpenses
};