const asyncHandler = require("express-async-handler");
const PrayingAmount = require("../../model/PrayingAmountSchema");
const PaySlip = require("../../model/PaySlipSchema");

const makeMonthlyPaySlipController = asyncHandler(async (req, res) => {
  const body = req.body;
  const isEmployeeAppliedForPrayingAmount = await PrayingAmount.findOne({
    employeeId: body.employeeId,
  });
  if (
    isEmployeeAppliedForPrayingAmount &&
    !isEmployeeAppliedForPrayingAmount.isPaid
  ) {
    const { deduction } = body;
    const { advance } = deduction;
    isEmployeeAppliedForPrayingAmount.totalAmount -= advance;
    isEmployeeAppliedForPrayingAmount.adjustmentDuration -= 1;
    console.log(isEmployeeAppliedForPrayingAmount.totalAmount);
    if (isEmployeeAppliedForPrayingAmount.totalAmount === 0) {
      isEmployeeAppliedForPrayingAmount.isPaid = true;
    }
    await isEmployeeAppliedForPrayingAmount.save();
  }
  const newPaySlip = new PaySlip(body);
  await newPaySlip.save();
  res.json({ message: "Done" });
});

module.exports = {
  makeMonthlyPaySlipController,
};
