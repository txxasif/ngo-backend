const asyncHandler = require("express-async-handler");
const AssetHead = require("../../model/AssetHeadSchema");
const Asset = require("../../model/AssetSchema");
const assetValidationSchema = require("../../schemaValidation/assetSchemaValidation");

const createPurchaseExpenseController = asyncHandler(async (req, res) => {
  const purchaseBody = req.body;

  // Validate the request body against the purchase schema
  const { error, value } = assetValidationSchema.validate(purchaseBody);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // Create and save a new Purchase document
  const newPurchases = new Asset(purchaseBody);
  await newPurchases.save();

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
  getAssetHeadListController,

};
