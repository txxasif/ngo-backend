const express = require("express");
const {
  createNewLoanAccountController,
  searchLoanAccountController,
  payLoanAccountController,
  countLoanProfitController,
  getLoanAccountsByBranchAndSamityId,
  ngoLoanCreateController,
} = require("../controller/loan/loanController");
const loanRoute = express.Router();

loanRoute.post("/create", createNewLoanAccountController);
loanRoute.post("/ngo-loan/create", ngoLoanCreateController);
loanRoute.get("/all", getLoanAccountsByBranchAndSamityId);
loanRoute.get("/search/:id", searchLoanAccountController);
loanRoute.post("/pay", payLoanAccountController);
loanRoute.get("/profit", countLoanProfitController);

module.exports = loanRoute;
