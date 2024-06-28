const asyncHandler = require("express-async-handler");
const expenseValidationSchema = require("../../schemaValidation/expenseSchemaValidation");
const Expense = require("../../model/ExpenseSchema");
const purchaseValidationSchema = require("../../schemaValidation/purchaseSchemaValidation");
const Purchase = require("../../model/purchaseSchema");
const ExpenseHead = require("../../model/ExpenseHeadSchema");
//  Controller for creating monthly expenses
const createMonthlyExpenseController = asyncHandler(async (req, res) => {
  const monthlyExpenseBody = req.body;

  // Validate the request body against the expense schema
  const { error } = expenseValidationSchema.validate(monthlyExpenseBody);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // Extract expense details from the request body
  const { officeRent, salary, stationaryAndPrinting, taDaAllowances, anyBill } = monthlyExpenseBody;

  // Calculate the total expense
  const total =
    Number(officeRent) +
    Number(salary) +
    Number(stationaryAndPrinting) +
    Number(anyBill) +
    Number(taDaAllowances);

  // Add the total to the expense body
  monthlyExpenseBody["total"] = total;

  // Create and save a new Expense document
  const newExpense = new Expense(monthlyExpenseBody);
  await newExpense.save();

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
// Controller for creating purchase expenses
const createPurchaseExpenseController = asyncHandler(async (req, res) => {
  const purchaseBody = req.body;

  // Validate the request body against the purchase schema
  const { error, value } = purchaseValidationSchema.validate(purchaseBody);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // Create and save a new Purchase document
  const newPurchases = new Purchase(purchaseBody);
  await newPurchases.save();

  return res.send({ message: "Done" });
});

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
  createPurchaseExpenseController,
  getExpenseList,
  createExpenseHeaderController,
  getExpenseHeadListController
};