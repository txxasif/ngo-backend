const asyncHandler = require("express-async-handler");
const expenseValidationSchema = require("../../schemaValidation/expenseSchemaValidation");
const Expense = require("../../model/ExpenseSchema");
const purchaseValidationSchema = require("../../schemaValidation/purchaseSchemaValidation");
const Purchase = require("../../model/purchaseSchema");
const createMonthlyExpenseController = asyncHandler(async (req, res) => {
  const monthlyExpenseBody = req.body;
  const { error } = expenseValidationSchema.validate(monthlyExpenseBody);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const newExpense = new Expense(monthlyExpenseBody);
  await newExpense.save();
  return res.send({ message: "done" });
});

const createPurchaseExpenseController = asyncHandler(async (req, res) => {
  const purchaseBody = req.body;
  console.log(purchaseBody);
  const { error, value } = purchaseValidationSchema.validate(purchaseBody);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const newPurchases = new Purchase(purchaseBody);
  await newPurchases.save();
  return res.send({ message: "Done" });
});

module.exports = {
  createMonthlyExpenseController,
  createPurchaseExpenseController,
};
