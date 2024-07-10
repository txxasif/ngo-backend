const asyncHandler = require("express-async-handler");
const drawerCashValidationSchema = require("../../schemaValidation/drawerCashSchemaValidation");
const DrawerCash = require("../../model/DrawerCashSchema");
const Samity = require("../../model/SamitySchema");
const addDrawerCashInOutController = asyncHandler(async (req, res) => {
  const drawerCashBody = req.body;
  const { error } = drawerCashValidationSchema.validate(drawerCashBody);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { samityId, amount, type } = drawerCashBody;
  const selectedSamity = await Samity.findOne({ _id: samityId });
  if (type === "cashIn") {
    selectedSamity.drawerCash += Number(amount);
  } else {
    selectedSamity.drawerCash -= Number(amount);
  }
  await selectedSamity.save();

  const newDrawerCash = new DrawerCash(drawerCashBody);
  await newDrawerCash.save();
  return res.json({ message: "Done" });
});
const samityDrawerCashDetailsController = asyncHandler(async (req, res) => {
  const data = await Samity.aggregate([
    {
      $match: {}
    },
    {
      $lookup: {
        from: "branches",
        foreignField: "_id",
        localField: "branchId",
        as: "branchDetails"
      }
    },
    {
      $unwind: "$branchDetails"
    },
    {
      $project: {
        _id: 1,
        branchName: '$branchDetails.branchName',
        drawerCash: 1,
        samityName: 1

      }
    }
  ])
  return res.json({ data: data });
})
const getDrawerCashDetailsBySamityIdController = asyncHandler(async (req, res) => {
  const samityId = req.params.id;
  console.log(samityId);
  const data = await DrawerCash.find({ samityId: samityId });
  console.log(data);
  return res.json({ data: data });
})
module.exports = {
  addDrawerCashInOutController,
  samityDrawerCashDetailsController,
  getDrawerCashDetailsBySamityIdController
};
