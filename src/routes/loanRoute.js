const express = require("express");
const {
  createNewLoanAccountController,
  searchLoanAccountController,
} = require("../controller/loan/loanController");
const loanRoute = express.Router();

loanRoute.post("/create", createNewLoanAccountController);
// loanRoute.post("/makeDeposit", makeDepositController);
// loanRoute.post("/makeWithdraw", withdrawController);
loanRoute.get("/search/:id", searchLoanAccountController);

module.exports = loanRoute;
