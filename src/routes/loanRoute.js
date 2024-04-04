const express = require("express");
const {
  createNewLoanAccountController,
} = require("../controller/loan/loanController");
const loanRoute = express.Router();

loanRoute.post("/create", createNewLoanAccountController);
// loanRoute.post("/makeDeposit", makeDepositController);
// loanRoute.post("/makeWithdraw", withdrawController);
// loanRoute.get("/search/:id", searchDepositAccountController);

module.exports = loanRoute;
