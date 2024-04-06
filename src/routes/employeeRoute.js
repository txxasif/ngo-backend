const express = require("express");

const employeeRoute = express.Router();

employeeRoute.post("/create", createNewLoanAccountController);
// employeeRoute.post("/makeDeposit", makeDepositController);
// employeeRoute.post("/makeWithdraw", withdrawController);
employeeRoute.get("/search/:id", searchLoanAccountController);

module.exports = employeeRoute;
