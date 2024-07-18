const asyncHandler = require("express-async-handler");
const expenseLiabilityJoiSchema = require("../../schemaValidation/expenseLiabilityValidation");
const ExpenseLiability = require("../../model/ExpenseLiability");

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
const createAssetLiabilityController = asyncHandler(async (req, res) => {
  const body = req.body;
  console.log(body);
  return res.json({ data: "done" });

})
module.exports = {

  createExpenseLiabilityController,
  createAssetLiabilityController
};
