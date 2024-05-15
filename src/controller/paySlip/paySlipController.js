const asyncHandler = require("express-async-handler");
const PrayingAmount = require("../../model/PrayingAmountSchema");
const PaySlip = require("../../model/PaySlipSchema");
const countOfficeDays = require("../../helper/countOfficeDays");

const makeMonthlyPaySlipController = asyncHandler(async (req, res) => {
  const body = req.body;
  console.log(body);
  const { date, branchId, samityId, employeeId } = body;
  delete body.date;
  delete body.branchId;
  delete body.samityId;
  const countTotalOfficeDays = await countOfficeDays(
    branchId,
    samityId,
    date,
    employeeId
  );
  console.log(countTotalOfficeDays);
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
