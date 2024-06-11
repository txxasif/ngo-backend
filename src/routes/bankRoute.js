const express = require("express");
const {
  addBankController,
  getAllBankController,
  addBankTransactionController,
  allBankCashDetailsController
} = require("../controller/bank/bankController");
const bankRoute = express.Router();

bankRoute.post("/add", addBankController);
bankRoute.get("/cash/all", allBankCashDetailsController);
bankRoute.get("/all", getAllBankController);
bankRoute.post(
  "/money-add",
  addBankTransactionController
);

module.exports = bankRoute;
