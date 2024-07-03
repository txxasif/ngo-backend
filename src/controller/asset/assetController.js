const asyncHandler = require("express-async-handler");
const AssetHead = require("../../model/AssetHeadSchema");
const Asset = require("../../model/AssetSchema");
const assetValidationSchema = require("../../schemaValidation/assetSchemaValidation");
const { assetWithdrawCashHelper } = require("../../helper/laonDrawerBankCashHelper");

const createAssetController = asyncHandler(async (req, res) => {
  const purchaseBody = req.body;
  const payFrom = purchaseBody.payFrom;
  console.log(payFrom);
  delete purchaseBody.payFrom;
  // Validate the request body against the purchase schema
  const { error, value } = assetValidationSchema.validate(purchaseBody);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const { date, by, total: amount } = purchaseBody;

  console.log(purchaseBody);
  // Create and save a new Purchase document
  console.log(1);
  const newPurchases = new Asset(purchaseBody);
  console.log(2);
  await newPurchases.save();
  console.log(3);
  await assetWithdrawCashHelper(payFrom, by, amount, date);
  console.log(4);
  return res.send({ message: "Done" });
});

const createAssetHeaderController = asyncHandler(async (req, res) => {
  const assetBody = req.body;
  const newAssetHeader = new AssetHead(assetBody);
  await newAssetHeader.save();
  return res.send({ message: "Done" });

});

const getAssetHeadListController = asyncHandler(async (req, res) => {
  const data = await AssetHead.find({}).lean();
  return res.json({ data });
})

module.exports = {
  createAssetHeaderController,
  createAssetController,
  getAssetHeadListController,

};
