const asyncHandler = require("express-async-handler");
const assetValidationSchema = require("../../schemaValidation/assetSchemaValidation");
const Asset = require("../../model/AssetSchema");
const addAssetController = asyncHandler(async (req, res) => {
  const assetBody = req.body;
  const { error } = assetValidationSchema.validate(assetBody);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const asset = new Asset(assetBody);
  await asset.save();
  res.json({ message: "Done" });
});

module.exports = {
  addAssetController,
};
