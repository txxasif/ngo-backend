const asyncHandler = require("express-async-handler");
const expenseLiabilityJoiSchema = require("../../schemaValidation/expenseLiabilityValidation");
const ExpenseLiability = require("../../model/ExpenseLiability");
const AssetLiability = require("../../model/AssetLiability");
const assetValidationSchema = require("../../schemaValidation/assetSchemaValidation");
const mongoose = require("mongoose");

const createExpenseLiabilityController = asyncHandler(async (req, res) => {
  const body = req.body;
  const { error, value } = expenseLiabilityJoiSchema.validate(body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const newExpenseLiability = new ExpenseLiability(body);
  await newExpenseLiability.save();
  res.json({ data: "done" });
})
const getExpenseLiabilityListController = asyncHandler(async (req, res) => {
  try {
    const { branchId, samityId } = req.query;
    console.log("hiiiiiiiii");
    const data = await ExpenseLiability.aggregate([
      {
        $match: { branchId: new mongoose.Types.ObjectId(branchId), samityId: new mongoose.Types.ObjectId(samityId), status: "unpaid" }
      },
      {
        $lookup: {
          from: "expenseheads",
          localField: "headId",
          foreignField: "_id",
          as: "head"
        }
      },
      {
        $unwind: "$head"
      },


      {
        $project: {
          _id: 1,
          branchId: 1,
          samityId: 1,
          amount: 1,
          head: "$head.name",
          headId: 1,
          date: 1,





        }
      }
    ]);
    return res.json({ data });
  } catch (er) {
    return res.json({ message: "Something went wrong" }).status(400);
  }

})
const payExpenseLiabilityController = asyncHandler(async (req, res) => {
  const body = req.body;
  const { expenseId, date } = body;
  const response = await ExpenseLiability.findOneAndUpdate({ _id: expenseId }, { status: "paid", paidDate: date }, { new: true });
  console.log(response);

  if (!response) {
    return res.status(404).json({ message: "Expense not found" });
  }

  return res.json({ message: "done" });
})
const createAssetLiabilityController = asyncHandler(async (req, res) => {
  const body = req.body;
  console.log(body);
  const { error, value } = assetValidationSchema.validate(body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const newAssetExpense = new AssetLiability(body);
  await newAssetExpense.save();
  return res.json({ data: "done" });

})
const getAssetLiabilityListController = asyncHandler(async (req, res) => {
  const { branchId, samityId } = req.query;
  const data = await AssetLiability.aggregate([
    {
      $match: { branchId: new mongoose.Types.ObjectId(branchId), samityId: new mongoose.Types.ObjectId(samityId) },
    },
    {
      $lookup: {
        from: "assetheads",
        localField: "headId",
        foreignField: "_id",
        as: "head",
      },
    },
    {
      $unwind: "$head",
    },
    {
      $project: {
        _id: 1,
        branchId: 1,
        samityId: 1,
        headId: 1,
        appreciation: 1,
        appreciation: 1,
        depreciation: 1,
        total: 1,
        tds: 1,
        tax: 1,
        vat: 1,
        unitAmount: 1,
        unitPrice: 1,
        head: "$head.name",
        date: 1,

      },
    }
  ])

  return res.json({ data });

})
const payAssetLiabilityController = asyncHandler(async (req, res) => {
  const liabilityId = req.params.id;
  console.log(liabilityId);

  const response = await AssetLiability.findOneAndDelete({ _id: liabilityId });
  return res.json({ message: "done" });
})
module.exports = {

  createExpenseLiabilityController,
  payExpenseLiabilityController,
  createAssetLiabilityController, getExpenseLiabilityListController,
  getAssetLiabilityListController,
  payAssetLiabilityController

};
