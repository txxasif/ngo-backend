const express = require("express");
const { savingsAccountListByBrachAndSamityController, createSavingsAccountController, transactionDetailsController, withdrawDetailsController, getSpecificDetailsForSavingsAccountController, makeDepositController, withdrawController } = require("../controller/savings/savingsController");
const savingsRoute = express.Router();

savingsRoute.post("/create", createSavingsAccountController);
savingsRoute.get("/list", savingsAccountListByBrachAndSamityController);
savingsRoute.get("/deposit-account/:id", getSpecificDetailsForSavingsAccountController);
savingsRoute.post("/makeDeposit", makeDepositController);
savingsRoute.post("/makeWithdraw", withdrawController);
savingsRoute.get("/transaction/:id", transactionDetailsController);
savingsRoute.get("/withdraw/:id", withdrawDetailsController);


module.exports = savingsRoute;