const express = require("express");
const { createFdrAccountController, getSpecificDetailsForFdrAccountController, transactionDetailsController, withdrawController, makeDepositController, withdrawDetailsController } = require("../controller/fdr/fdrController");
const fdrRoute = express.Router();

fdrRoute.post("/create", createFdrAccountController);
fdrRoute.get("/deposit-account/:id", getSpecificDetailsForFdrAccountController);
fdrRoute.post("/makeDeposit", makeDepositController);
fdrRoute.post("/makeWithdraw", withdrawController);
fdrRoute.get("/transaction/:id", transactionDetailsController);
fdrRoute.get("/withdraw/:id", withdrawDetailsController);
module.exports = fdrRoute;