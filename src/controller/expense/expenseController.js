const asyncHandler = require("express-async-handler");
const expenseValidationSchema = require("../../schemaValidation/expenseSchemaValidation");
const Expense = require("../../model/ExpenseSchema");
const ExpenseHead = require("../../model/ExpenseHeadSchema");
const { expenseWithdrawCashHelper } = require("../../helper/laonDrawerBankCashHelper");
const mongoose = require("mongoose");
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
const getExpenseListController = asyncHandler(async (req, res) => {
  const { branchId, samityId, from, to } = req.query;
  console.log(from, to);


  // Convert from and to to Date objects if they exist
  const fromDate = from ? new Date(from) : null;
  const toDate = to ? new Date(to) : null;

  // Build the aggregation pipeline
  const pipeline = [
    {
      $match: {
        branchId: new mongoose.Types.ObjectId(branchId),
        samityId: new mongoose.Types.ObjectId(samityId),
        ...(fromDate && toDate ? { date: { $gte: fromDate, $lte: toDate } } : {}),
      },
    },

    {
      $sort: { date: -1 } // Optional: sort by date in descending order
    }
  ];

  try {
    const data = await Expense.aggregate([
      {
        $match: {
          branchId: new mongoose.Types.ObjectId(branchId),
          samityId: new mongoose.Types.ObjectId(samityId),
          ...(fromDate && toDate ? { date: { $gte: fromDate, $lte: toDate } } : {}),
        },
      },
      {
        $lookup: {
          from: "expenseheads", // Name of the collection for ExpenseHead
          localField: "headId",
          foreignField: "_id",
          as: "head",
        },
      },
      {
        $unwind: "$head", // Deconstruct the array from the $lookup stage
      },
      {
        $project: {
          _id: 0, // Exclude the _id field
          headName: "$head.name",
          date: 1,
          amount: 1,
          by: 1, // Include the `by` field
        },
      },
      {
        $sort: { date: -1 } // Optional: sort by date in descending order
      }
    ]).exec();
    console.log(data, 'data');

    return res.json({ data });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Server error", error });
  }
});


module.exports = {
  createMonthlyExpenseController,
  getExpenseListController,
  createExpenseHeaderController,
  getExpenseHeadListController
};