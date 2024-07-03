const asyncHandler = require("express-async-handler");
const expenseValidationSchema = require("../../schemaValidation/expenseSchemaValidation");
const Expense = require("../../model/ExpenseSchema");
const ExpenseHead = require("../../model/ExpenseHeadSchema");
const { expenseWithdrawCashHelper } = require("../../helper/laonDrawerBankCashHelper");
//  Controller for creating monthly expenses
const createMonthlyExpenseController = asyncHandler(async (req, res) => {
  const monthlyExpenseBody = req.body;
  const { date, by, amount } = monthlyExpenseBody;
  const payFrom = monthlyExpenseBody.payFrom;
  delete monthlyExpenseBody.payFrom;
  // Validate the request body against the expense schema
  const { error } = expenseValidationSchema.validate(monthlyExpenseBody);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  // Create and save a new Expense document
  const newExpense = new Expense(monthlyExpenseBody);
  await Promise.all([
    newExpense.save(),
    expenseWithdrawCashHelper(payFrom, by, amount, date),
  ])

  return res.send({ message: "done" });
});
const createExpenseHeaderController = asyncHandler(async (req, res) => {
  const expenseBody = req.body;
  const newExpenseHeader = new ExpenseHead(expenseBody);
  await newExpenseHeader.save();
  return res.send({ message: "Done" });

});
// Controller for getting expense head 
const getExpenseHeadListController = asyncHandler(async (req, res) => {
  const data = await ExpenseHead.find({}).lean();
  return res.json({ data });
})


// Controller for getting expense list
const getExpenseList = asyncHandler(async (req, res) => {
  const { branchId, samityId, type } = req.query;
  let data = [];

  // Fetch expenses based on the type (monthly or purchase)
  if (type === "monthly") {
    const monthly = await Expense.find({ branchId, samityId }).lean();
    data = monthly;
  } else {
    const purchase = await Purchase.find({ branchId, samityId }).lean();
    data = purchase;
  }

  return res.json({ data });
});

module.exports = {
  createMonthlyExpenseController,
  getExpenseList,
  createExpenseHeaderController,
  getExpenseHeadListController
};