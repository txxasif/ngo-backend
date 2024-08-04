const asyncHandler = require("express-async-handler");
const AssetHead = require("../../model/AssetHeadSchema");
const Asset = require("../../model/AssetSchema");
const assetValidationSchema = require("../../schemaValidation/assetSchemaValidation");
const { assetWithdrawCashHelper } = require("../../helper/laonDrawerBankCashHelper");
const mongoose = require("mongoose");

const createAssetController = asyncHandler(async (req, res) => {
  const purchaseBody = req.body;
  const payFrom = purchaseBody.payFrom;
  delete purchaseBody.payFrom;
  // Validate the request body against the purchase schema
  const { error, value } = assetValidationSchema.validate(purchaseBody);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const { date, by, total: amount } = purchaseBody;
  const newPurchases = new Asset(purchaseBody);
  await newPurchases.save();
  await assetWithdrawCashHelper(payFrom, by, amount, date);
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
// Controller for getting expense list
const getAssetListController = asyncHandler(async (req, res) => {
  const { branchId, samityId, from, to } = req.query;
  // Convert from and to to Date objects if they exist
  const fromDate = from ? new Date(from) : null;
  const toDate = to ? new Date(to) : null;



  // Build the aggregation pipeline


  try {
    const data = await Asset.aggregate([
      {
        $match: {
          branchId: new mongoose.Types.ObjectId(branchId),
          samityId: new mongoose.Types.ObjectId(samityId),

        },
      },
      {
        $lookup: {
          from: "assetheads", // Name of the collection for ExpenseHead
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
          total: 1,
          unitPrice: 1,
          unitAmount: 1,
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
  createAssetHeaderController,
  createAssetController,
  getAssetHeadListController,
  getAssetListController


};
