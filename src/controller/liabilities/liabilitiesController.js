const asyncHandler = require("express-async-handler");
const expenseLiabilityJoiSchema = require("../../schemaValidation/expenseLiabilityValidation");
const ExpenseLiability = require("../../model/ExpenseLiability");
const AssetLiability = require("../../model/AssetLiability");
const assetValidationSchema = require("../../schemaValidation/assetSchemaValidation");
const { default: mongoose } = require("mongoose");

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
        $match: { branchId: new mongoose.Types.ObjectId(branchId), samityId: new mongoose.Types.ObjectId(samityId) }
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
          date: 1



        }
      }
    ]);
    console.log(data);
    return res.json({ data });
  } catch (er) {
    console.log(er);
  }

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
  const data = AssetLiability.find({ branchId, samityId });
  return res.json({ data });

})
module.exports = {

  createExpenseLiabilityController,
  createAssetLiabilityController, getExpenseLiabilityListController,
  getAssetLiabilityListController

};
