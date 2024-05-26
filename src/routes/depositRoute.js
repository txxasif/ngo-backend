const express = require("express");
const {
  createDepositAccountController,
  makeDepositController,
  searchDepositAccountController,
  withdrawController,
  acceptPendingDepositList,
  depositAccountListByBrachAndSamityController,
  getPendingDepositAccountList,
  depositAccountListsByPhoneNumber
  , getSpecificDetailsForDepositAccountController, transactionDetailsController, withdrawDetailsController
} = require("../controller/deposit/depositController");
const depositRoute = express.Router();

depositRoute.post("/create", createDepositAccountController);
depositRoute.post("/makeDeposit", makeDepositController);
depositRoute.post("/makeWithdraw", withdrawController);

depositRoute.get("/pending", getPendingDepositAccountList);
depositRoute.get("/accept/:id", acceptPendingDepositList);
depositRoute.get("/deposit-account/:id", getSpecificDetailsForDepositAccountController);
depositRoute.get("/transaction/:id", transactionDetailsController);
depositRoute.get("/withdraw/:id", withdrawDetailsController);

depositRoute.get("/list", depositAccountListByBrachAndSamityController);
depositRoute.get('/account/list/:id', depositAccountListsByPhoneNumber);
depositRoute.get("/search/:id", searchDepositAccountController);

module.exports = depositRoute;
