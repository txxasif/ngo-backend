const express = require("express");
const {
  createDepositAccountController,
  searchDepositAccountController,
} = require("../controller/deposit/depositController");
const depositRoute = express.Router();

depositRoute.post("/create", createDepositAccountController);
depositRoute.get("/search/:id", searchDepositAccountController);

module.exports = depositRoute;
