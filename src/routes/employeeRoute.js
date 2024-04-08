const express = require("express");
const {
  createEmployeeController,
  searchEmployeeController,
  setEmployeeCredentialsCredentialsController,
} = require("../controller/emoloyee/employeeController");

const employeeRoute = express.Router();

employeeRoute.post("/create", createEmployeeController);
employeeRoute.post("/credentials", setEmployeeCredentialsCredentialsController);
employeeRoute.get("/search/:id", searchEmployeeController);

module.exports = employeeRoute;
