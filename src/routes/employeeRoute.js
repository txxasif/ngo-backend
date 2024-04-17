const express = require("express");
const {
  createEmployeeController,
  searchEmployeeController,
  setEmployeeCredentialsCredentialsController,
  getAllEmployeesAttendanceController,
  setEmployeesAttendanceController,
  getEmployeeAttendanceCountController,
} = require("../controller/emoloyee/employeeController");

const employeeRoute = express.Router();

employeeRoute.post("/create", createEmployeeController);
employeeRoute.post("/credentials", setEmployeeCredentialsCredentialsController);
employeeRoute.get("/search/:id", searchEmployeeController);
// Attendance Section
employeeRoute.get("/attendance", getAllEmployeesAttendanceController);
employeeRoute.post("/set-attendance", setEmployeesAttendanceController);
employeeRoute.get("/attendance-count", getEmployeeAttendanceCountController);
module.exports = employeeRoute;
