const express = require("express");
const {
  createDepositAccountController,
  makeDepositController,
  searchDepositAccountController,
  withdrawController,
  depositAccountListByBrachAndSamityController,
} = require("../controller/deposit/depositController");
const depositRoute = express.Router();

depositRoute.post("/create", createDepositAccountController);
depositRoute.post("/makeDeposit", makeDepositController);
depositRoute.get("/list", depositAccountListByBrachAndSamityController);
depositRoute.post("/makeWithdraw", withdrawController);
depositRoute.get("/search/:id", searchDepositAccountController);

module.exports = depositRoute;
