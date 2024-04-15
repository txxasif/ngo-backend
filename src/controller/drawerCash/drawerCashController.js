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

module.exports = {
  addDrawerCashInOutController,
};
