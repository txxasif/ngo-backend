const express = require("express");
const {
  createDepositAccountController,
} = require("../controller/deposit/depositController");
const depositRoute = express.Router();

depositRoute.post("/create", createDepositAccountController);

module.exports = depositRoute;
