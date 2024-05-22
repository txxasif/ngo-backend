const asyncHandler = require("express-async-handler");
const PrayingAmount = require("../../model/PrayingAmountSchema");
const PaySlip = require("../../model/PaySlipSchema");
const Employee = require("../../model/EmployeeSchema");

const makeMonthlyPaySlipController = asyncHandler(async (req, res) => {
  const body = req.body;
  const { due, employeeId } = body;
  const employee = await Employee.findOne({ _id: employeeId });
  employee.salaryDue = due;
  employee.leaveDays = 0;
  await employee.save();
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
    if (isEmployeeAppliedForPrayingAmount.totalAmount === 0) {
      isEmployeeAppliedForPrayingAmount.isPaid = true;
    }
    await isEmployeeAppliedForPrayingAmount.save();
  }
  const newPaySlip = new PaySlip(body);
  await newPaySlip.save();
  res.json({ message: "Done" });
});
const getEmployeePaySlipByYearAndMonthController = asyncHandler(
  async (req, res) => {
    // const { year, month } = req.query;
    // const startDate = new Date(year, month - 1, 1);
    // const endDate = new Date(year, month, 0);
    const paySlips = await PaySlip.aggregate([
      {
        $match: {
          // createdAt: {
          //   $gte: startDate,
          //   $lte: endDate,
          // },
        },
      },
      {
        $lookup: {
          from: "employees",
          localField: "employeeId",
          foreignField: "_id",
          as: "employee",
        },
      },
      {
        $unwind: "$employee",
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $project: {
          name: "$employee.name",
          basicSalary: 1,
          mobileBill: 1,
          tourBill: 1,
          overTime: 1,
          specialAward: 1,
          bonus: 1,
          total: 1,
          totalPaid: 1,
          due: 1,
          deduction: 1,
        },
      },
    ]);
    return res.json(paySlips);
  }
);
module.exports = {
  makeMonthlyPaySlipController,
  getEmployeePaySlipByYearAndMonthController,
};
