const express = require("express");
const {
  createNewLoanAccountController,
  searchLoanAccountController,
  payLoanAccountController,
  countLoanProfitController,
  getLoanAccountsByBranchAndSamityId,
  ngoLoanCreateController,
  ngoLoanPayController,
  ngoLoanPaymentDetailsByLoanIdController,
  ngoLoanPayListController,
  searchLoanAccountsTransactionsController,
} = require("../controller/loan/loanController");
const loanRoute = express.Router();

loanRoute.post("/create", createNewLoanAccountController);

loanRoute.get("/ngo-loan/list", ngoLoanPayListController);
loanRoute.post("/ngo-loan/create", ngoLoanCreateController);
loanRoute.post("/ngo-loan/pay", ngoLoanPayController);
loanRoute.get("/ngo-loan/:id", ngoLoanPaymentDetailsByLoanIdController);

loanRoute.get("/all", getLoanAccountsByBranchAndSamityId);
loanRoute.get("/search/:id", searchLoanAccountController);
loanRoute.get(
  "/user-transaction/search/:id",
  searchLoanAccountsTransactionsController
);
loanRoute.post("/pay", payLoanAccountController);
loanRoute.get("/profit", countLoanProfitController);

module.exports = loanRoute;
