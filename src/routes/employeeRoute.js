const express = require("express");
const {
  createEmployeeController,
  searchEmployeeController,
  setEmployeeCredentialsCredentialsController,
  getAllEmployeesAttendanceController,
  setEmployeesAttendanceController,
  getEmployeeAttendanceCountController,
  getEmployeeByBranchAndSamityId,
  getAttendenceCountController,
  searchEmployeeControllerForPaySlip,
  updateEmployeeController,
} = require("../controller/emoloyee/employeeController");

const employeeRoute = express.Router();

employeeRoute.post("/create", createEmployeeController);
employeeRoute.put("/update/:id", updateEmployeeController);
employeeRoute.post("/credentials", setEmployeeCredentialsCredentialsController);
employeeRoute.get("/search/:id", searchEmployeeController);
employeeRoute.get("/payslip/search/:id", searchEmployeeControllerForPaySlip);
employeeRoute.get("/test", getAttendenceCountController);
// Attendance Section
employeeRoute.get("/attendance", getAllEmployeesAttendanceController);
employeeRoute.post("/set-attendance", setEmployeesAttendanceController);
employeeRoute.get("/attendance-count", getEmployeeAttendanceCountController);
employeeRoute.get("/all", getEmployeeByBranchAndSamityId);
module.exports = employeeRoute;
