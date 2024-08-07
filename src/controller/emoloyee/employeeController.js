const asyncHandler = require("express-async-handler");
const employeeSchemaValidation = require("../../schemaValidation/EmployeeValidationSchema");
const Employee = require("../../model/EmployeeSchema");
const bcrypt = require("bcrypt");
const Attendance = require("../../model/EmployeeAttendanceSchema");
const PrayingAmount = require("../../model/PrayingAmountSchema");
const countOfficeDays = require("../../helper/countOfficeDays");
const LeaveApplication = require("../../model/leaveApplication");
const { employeeSecurityFundCashHelper } = require("../../helper/laonDrawerBankCashHelper");

const createEmployeeController = asyncHandler(async (req, res) => {
  const employeeBody = req.body;
  // Validate employee schema
  const by = employeeBody.by;
  const date = employeeBody.date;
  delete employeeBody.date;
  delete employeeBody.by;
  const { error } = employeeSchemaValidation.validate(employeeBody);
  console.log(error);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // Check if email already exists
  const existingEmail = await Employee.findOne({ email: employeeBody.email });
  if (existingEmail) {
    return res.status(400).json({ message: "Email already exists" });
  }

  // Check if mobile number already exists
  const existingMobile = await Employee.findOne({
    mobileNumber: employeeBody.mobileNumber,
  });
  if (existingMobile) {
    return res.status(400).json({ message: "Mobile number already exists" });
  }
  const { samityId, presentPosition } = employeeBody;
  const amount = presentPosition.employeeSecurityFund;


  // Create new employee
  const employee = new Employee(employeeBody);
  await employeeSecurityFundCashHelper(samityId, by, amount, date);
  await employee.save();
  res.json({ message: "Done" });
});
const updateEmployeeController = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;
    const result = await Employee.findByIdAndUpdate(
      { _id: id },
      { $set: { ...body } }
    );
    return res.status(200).json({ message: "Employee updated" });
  } catch (error) {
    return res.status(400).json({ message: "Something went wrong" });
  }
});
const searchEmployeeController = asyncHandler(async (req, res) => {
  const number = req.params.id;
  console.log(number);
  const employee = await Employee.findOne({ mobileNumber: number })
    .select("-password")
    .lean();

  if (!employee) {
    return res.status(404).json({ message: "No employee found" });
  }
  let adjustmentAmount = 0;
  const providentFund = await PrayingAmount.findOne({
    employeeId: employee._id,
  });
  if (providentFund) {
    const { adjustmentAmount: amount } = providentFund;
    adjustmentAmount = amount;
  }

  const data = {
    ...employee,
    advance: adjustmentAmount,
  };

  return res.json({ data: [data] });
});
const searchEmployeeControllerForPaySlip = asyncHandler(async (req, res) => {
  const number = req.params.id;
  const { date } = req.query;
  console.log(date);
  const employee = await Employee.findOne({ mobileNumber: number })
    .select("-password")
    .lean();
  if (!employee) {
    return res.status(404).json({ message: "No employee found" });
  }

  const { _id, branchId, samityId, presentPosition, leaveDays } = employee;
  const salary = presentPosition.salaryAmount;
  const countDays = await countOfficeDays(branchId, samityId, date, _id);
  const { officeAttendanceCount, employeeAttendanceCount } = countDays;
  let totalAbsent = officeAttendanceCount - (employeeAttendanceCount + leaveDays);

  let perDay = salary / 30;
  let totalAbsentCal = totalAbsent / 2;
  let absent = totalAbsentCal * perDay;
  let adjustmentAmount = 0;
  const providentFund = await PrayingAmount.findOne({
    employeeId: employee._id,
  });
  if (providentFund) {
    const { adjustmentAmount: amount } = providentFund;
    adjustmentAmount = amount;
  }

  const data = {
    ...employee,
    totalAbsent: absent < 0 ? 0 : absent,
    advance: adjustmentAmount,
  };

  return res.json({ data: [data] });
});

const setEmployeeCredentialsCredentialsController = asyncHandler(
  async (req, res) => {
    const { employeeId, password } = req.body;
    console.log(employeeId);

    const isEmployeeExist = await Employee.findOne({ _id: employeeId });
    console.log(isEmployeeExist);

    if (!isEmployeeExist) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const newHashedPass = await bcrypt.hash(password, 10);
    isEmployeeExist.password = newHashedPass;
    await isEmployeeExist.save();
    return res.json({ message: "done" });
  }
);

// !attendance count controller
const getAttendenceCountController = asyncHandler(async (req, res) => {
  console.log("hit");
  const { samityId, branchId, date } = req.query;
  const count = await countOfficeDays(branchId, samityId, date);
  res.json({ count: count });
});
const getAllEmployeesAttendanceController = asyncHandler(async (req, res) => {
  const { branchId, samityId, date } = req.query;
  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0 for the start of the day
  const endDate = new Date(date);
  endDate.setHours(23, 59, 59, 999); // Set hours, minutes, seconds, and milliseconds to the end of the day

  const existingAttendance = await Attendance.findOne({
    samityId,
    branchId,
    date: {
      $gte: startDate, // Greater than or equal to the start of the day
      $lt: endDate, // Less than the end of the day
    },
  });

  if (existingAttendance) {
    console.log("FOund");
  } else {
    const presentEmployees = [];
    const attendance = new Attendance({
      samityId,
      branchId,
      date,
      presentEmployees,
    });
    await attendance.save();
  }
  const employees = await Employee.find({ branchId, samityId }).select(
    "name _id mobileNumber email photo"
  );
  console.log(existingAttendance);
  return res.json({
    data: employees,
    attendance: existingAttendance ? existingAttendance.presentEmployees : [],
  });
});
const setEmployeesAttendanceController = asyncHandler(async (req, res) => {
  try {
    const presentEmployees = req.body;
    const { branchId, samityId, date } = req.query;
    // Convert date string to Date object
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0 for the start of the day
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999); // Set hours, minutes, seconds, and milliseconds to the end of the day
    console.log(presentEmployees, branchId, samityId, date);
    const existingAttendance = await Attendance.findOne({
      samityId,
      branchId,
      date: {
        $gte: startDate, // Greater than or equal to the start of the day
        $lt: endDate, // Less than the end of the day
      },
    });
    existingAttendance.presentEmployees = presentEmployees;
    await existingAttendance.save();
    return res.json({ message: "Attendance saved successfully!" });
  } catch (err) {
    res.status(404).json({ message: "Something went wrong" });
  }
});

const getEmployeeAttendanceCountController = asyncHandler(async (req, res) => {
  const { userId, year, month } = req.query;
  // Calculate the start and end dates of the specified month
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);
  console.log(userId, year, month);
  const attendanceRecords = await Attendance.find({
    date: {
      $gte: startDate,
      $lte: endDate,
    },
    presentEmployees: { $in: [userId] }, // Use $in operator to find documents where userId is in the presentEmployees array
  });
  res.json({ attendanceRecords: attendanceRecords.length });
});
// * get users by branch and samity id
const getEmployeeByBranchAndSamityId = asyncHandler(async (req, res) => {
  const branchId = req.query.branchId;
  const samityId = req.query.samityId;
  const users = await Employee.find({ branchId, samityId });

  res.json({ data: users });
});
const createEmployeeLeaveApplicationController = asyncHandler(async (req, res) => {
  const body = req.body;
  const newLeaveApplication = new LeaveApplication({ ...body });
  await newLeaveApplication.save();
  console.log(body);
  return res.json({ message: "done" });
})
const employeeLeaveApplicationListController = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const applications = await LeaveApplication.find({ employeeId: id });
  return res.json({ data: applications })
})
const employeeLeaveApplicationPendingListController = asyncHandler(async (req, res) => {
  const applications = await LeaveApplication.aggregate([{
    $match: {
      status: "pending"
    }
  }, {
    $lookup: {
      from: "employees",
      localField: "employeeId",
      foreignField: "_id",
      as: "employee"
    }
  }, {
    $unwind: "$employee"
  }, {
    $lookup: {
      from: "branches",
      localField: "employee.branchId",
      foreignField: "_id",
      as: "branch"
    }
  },
  {
    $lookup: {
      from: 'samities',
      localField: 'employee.samityId',
      foreignField: '_id',
      as: 'samity'
    }
  },
  {
    $unwind: "$branch"
  },
  {
    $unwind: "$samity"
  },
  {
    $project: {
      _id: 1,
      employeeName: "$employee.name",
      branchName: "$branch.branchName",
      samityName: "$samity.samityName",
      days: 1,
      reason: 1,

    }
  }])
  return res.json({ data: applications })
})
const employeeLeaveApplicationAcceptOrRejectController = asyncHandler(async (req, res) => {
  const { id, status } = req.body;
  await Employee.updateMany({}, { $set: { leaveDays: 0 } })
  const application = await LeaveApplication.findById(id);
  if (status === "accepted") {
    application.status = "accepted";
    const employee = await Employee.findById(application.employeeId);
    employee.leaveDays = application.days
    await employee.save();
  } else {
    application.status = "rejected";
  }
  await application.save();
  return res.json({ message: "success" })
})
module.exports = {
  createEmployeeController,
  searchEmployeeController,
  setEmployeeCredentialsCredentialsController,
  getAllEmployeesAttendanceController,
  setEmployeesAttendanceController,
  getEmployeeAttendanceCountController,
  getEmployeeByBranchAndSamityId,
  getAttendenceCountController,
  searchEmployeeControllerForPaySlip,
  createEmployeeLeaveApplicationController,
  employeeLeaveApplicationListController,
  employeeLeaveApplicationPendingListController,
  updateEmployeeController,
  employeeLeaveApplicationAcceptOrRejectController
};
