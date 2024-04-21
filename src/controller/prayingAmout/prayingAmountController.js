const asyncHandler = require("express-async-handler");
const PrayingAmount = require("../../model/PrayingAmountSchema");

const createPrayingAmountApplicationController = asyncHandler(
  async (req, res) => {
    const body = req.body;
    const isPrayingApplicationExists = await PrayingAmount.findOne({
      employeeId: body.employeeId,
    });
    console.log(isPrayingApplicationExists);
    if (!isPrayingApplicationExists) {
      const newPrayingAmount = new PrayingAmount(body);
      await newPrayingAmount.save();
      return res.json({ message: "Application Granted" });
    }
    if (
      isPrayingApplicationExists.isPaid &&
      isPrayingApplicationExists.totalAmount == 0
    ) {
      const { totalAmount, adjustmentDuration, adjustmentAmount, reason } =
        body;

      isPrayingApplicationExists.totalAmount = totalAmount;
      isPrayingApplicationExists.adjustmentAmount = adjustmentAmount;
      isPrayingApplicationExists.adjustmentDuration = adjustmentDuration;
      isPrayingApplicationExists.reason = reason;
      isPrayingApplicationExists.isPaid = false;
      return res.json({ message: "Application Granted" });
    }
    return res.status(400).json({ message: "Please Pay Previous Due" });
  }
);

module.exports = {
  createPrayingAmountApplicationController,
};
