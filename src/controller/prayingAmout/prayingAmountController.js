const asyncHandler = require("express-async-handler");
const PrayingAmount = require("../../model/PrayingAmountSchema");
const { advanceSalaryCashHelper } = require("../../helper/laonDrawerBankCashHelper");

const createPrayingAmountApplicationController = asyncHandler(
  async (req, res) => {
    const body = req.body;
    const payFrom = body.payFrom;
    const { by, date, totalAmount } = body;
    delete body.payFrom;
    const isPrayingApplicationExists = await PrayingAmount.findOne({
      employeeId: body.employeeId,
    });
    if (!isPrayingApplicationExists) {
      const newPrayingAmount = new PrayingAmount(body);
      await newPrayingAmount.save();
      await advanceSalaryCashHelper(payFrom, by, totalAmount, date);
      return res.json({ message: "Application Granted" });
    }
    if (
      isPrayingApplicationExists.isPaid &&
      isPrayingApplicationExists.totalAmount == 0
    ) {
      const { totalAmount, reason } =
        body;

      isPrayingApplicationExists.totalAmount = totalAmount;
      isPrayingApplicationExists.reason = reason;
      isPrayingApplicationExists.isPaid = false;
      await isPrayingApplicationExists.save();
      await advanceSalaryCashHelper(payFrom, by, totalAmount, date);
      return res.json({ message: "Application Granted" });
    }
    return res.status(400).json({ message: "Please Pay Previous Due" });
  }
);

module.exports = {
  createPrayingAmountApplicationController,
};
