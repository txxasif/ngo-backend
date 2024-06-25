const express = require("express");
const {
  addBankController,
  getAllBankController,
  addBankTransactionController,
  allBankCashDetailsController,
  getSpecificDetailsByBankIdController
} = require("../controller/bank/bankController");
const bankRoute = express.Router();

bankRoute.post("/add", addBankController);
bankRoute.get("/cash/all", allBankCashDetailsController);
bankRoute.get("/all", getAllBankController);
bankRoute.post(
  "/money-add",
  addBankTransactionController
);
bankRoute.get("/bank/:id", getSpecificDetailsByBankIdController);

module.exports = bankRoute;
