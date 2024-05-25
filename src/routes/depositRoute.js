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
} = require("../controller/deposit/depositController");
const depositRoute = express.Router();

depositRoute.post("/create", createDepositAccountController);
depositRoute.post("/makeDeposit", makeDepositController);
depositRoute.get("/pending", getPendingDepositAccountList);
depositRoute.get("/accept/:id", acceptPendingDepositList);
depositRoute.get("/list", depositAccountListByBrachAndSamityController);
depositRoute.post("/makeWithdraw", withdrawController);
depositRoute.get('/account/list/:id', depositAccountListsByPhoneNumber);
depositRoute.get("/search/:id", searchDepositAccountController);

module.exports = depositRoute;
