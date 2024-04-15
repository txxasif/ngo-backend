const express = require("express");
const {
  addBankController,
  getAllBankController,
  addBankTransactionController,
} = require("../controller/bank/bankController");
const bankRoute = express.Router();

bankRoute.post("/add", addBankController);
bankRoute.get("/all", getAllBankController);
bankRoute.post(
  "/from_drawer_to_bank/transaction",
  addBankTransactionController
);

module.exports = bankRoute;
