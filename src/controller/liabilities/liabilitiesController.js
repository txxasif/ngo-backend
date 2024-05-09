const asyncHandler = require("express-async-handler");
const { countAllLiability } = require("../../helper/liabilitiesCount");
const getLiabilitiesDetailsController = asyncHandler(async (req, res) => {
  const result = await countAllLiability();
  return res.json({ data: result });
});

module.exports = {
  getLiabilitiesDetailsController,
};
