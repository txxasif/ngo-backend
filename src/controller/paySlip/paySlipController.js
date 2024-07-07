const asyncHandler = require("express-async-handler");
const PrayingAmount = require("../../model/PrayingAmountSchema");
const PaySlip = require("../../model/PaySlipSchema");
const Employee = require("../../model/EmployeeSchema");
const moment = require("moment");
const { default: mongoose } = require("mongoose");
const { paySlipCashHelper } = require("../../helper/laonDrawerBankCashHelper");


const makeMonthlyPaySlipController = asyncHandler(async (req, res) => {
  const body = req.body;

  const { due, employeeId, date: d, by } = body;
  let date = moment(d);
  let minusDate = date.subtract(1, 'months');
  body['salaryMonthAndYear'] = new Date(minusDate);
  const payFrom = body.payFrom;
  const amount = body.totalPaid;
  delete body.payFrom;
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
  await paySlipCashHelper(payFrom, by, amount, d);
  await newPaySlip.save();
  res.json({ message: "Done" });
});
const getEmployeePaySlipByYearAndMonthController = asyncHandler(
  async (req, res) => {
    const { branchId, samityId, date } = req.query;
    const parsedDate = new Date(date);
    if (isNaN(parsedDate)) {
      return res.status(400).json({ message: "Invalid date format" });
    }
    if (!branchId || !samityId) {
      return res.status(400).json({ message: "Invalid branch or samity id" });
    }
    const month = parsedDate.getMonth(); // Adjust to 1-12 range
    const year = parsedDate.getFullYear();
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    const paySlips = await PaySlip.aggregate([
      {
        $match: {
          salaryMonthAndYear: {
            $gte: startDate,
            $lte: endDate,
          },
          branchId: new mongoose.Types.ObjectId(branchId),
          samityId: new mongoose.Types.ObjectId(samityId),
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
          date: -1,
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
