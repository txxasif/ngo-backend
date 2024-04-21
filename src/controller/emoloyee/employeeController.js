const asyncHandler = require("express-async-handler");
const employeeSchemaValidation = require("../../schemaValidation/EmployeeValidationSchema");
const Employee = require("../../model/EmployeeSchema");
const bcrypt = require("bcrypt");
const Attendance = require("../../model/EmployeeAttendanceSchema");
const PrayingAmount = require("../../model/PrayingAmountSchema");
const createEmployeeController = asyncHandler(async (req, res) => {
  const employeeBody = req.body;
  console.log(employeeBody);

  // Validate employee schema
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

  // Create new employee
  const employee = new Employee(employeeBody);
  await employee.save();
  res.json({ message: "Done" });
});

const searchEmployeeController = asyncHandler(async (req, res) => {
  const number = req.params.id;
  const employee = await Employee.findOne({ mobileNumber: number }).lean();

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
const getAllEmployeesAttendanceController = asyncHandler(async (req, res) => {
  const { branchId, samityId, date } = req.query;
  // Convert date string to Date object
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
    console.log(existingAttendance);
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
module.exports = {
  createEmployeeController,
  searchEmployeeController,
  setEmployeeCredentialsCredentialsController,
  getAllEmployeesAttendanceController,
  setEmployeesAttendanceController,
  getEmployeeAttendanceCountController,
};
