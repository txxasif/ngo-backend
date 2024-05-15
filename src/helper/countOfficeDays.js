const moment = require("moment");
const Attendance = require("../model/EmployeeAttendanceSchema");

async function countOfficeDays(branchId, samityId, date, employeeId) {
  const currentDate = new Date(date);
  const previousMonthDate = new Date(currentDate);

  // Subtract one month from the current date
  previousMonthDate.setMonth(previousMonthDate.getMonth() - 1);

  // Handle edge case: if the previous month is December, subtract one year as well
  if (previousMonthDate.getMonth() === 11) {
    previousMonthDate.setFullYear(previousMonthDate.getFullYear() - 1);
  }

  // Get the start date of the previous month
  const startDate = new Date(
    previousMonthDate.getFullYear(),
    previousMonthDate.getMonth(),
    1
  );

  // Get the end date of the previous month
  const endDate = new Date(
    previousMonthDate.getFullYear(),
    previousMonthDate.getMonth() + 1,
    0
  );

  // Query the database to find attendance records within the previous month
  const officeAttendanceCount = await Attendance.countDocuments({
    samityId,
    branchId,
    date: {
      $gte: startDate,
      $lte: endDate,
    },
    presentEmployees: { $exists: true, $ne: [] }, // Check if presentEmployees array isn't empty
  });
  const employeeAttendanceCount = await Attendance.countDocuments({
    samityId,
    branchId,
    date: {
      $gte: startDate,
      $lte: endDate,
    },
    presentEmployees: { $in: [employeeId] }, // Use $in operator to find documents where userId is in the presentEmployees array
  });

  return { officeAttendanceCount, employeeAttendanceCount };
}

module.exports = countOfficeDays;
