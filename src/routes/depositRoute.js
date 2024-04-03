const express = require("express");
const {
  createDepositAccountController,
  makeDepositController,
  searchDepositAccountController,
} = require("../controller/deposit/depositController");
const depositRoute = express.Router();

depositRoute.post("/create", createDepositAccountController);
depositRoute.post("/makeDeposit", makeDepositController);
depositRoute.get("/search/:id", searchDepositAccountController);

module.exports = depositRoute;
