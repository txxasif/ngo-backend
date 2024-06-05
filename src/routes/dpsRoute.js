const express = require("express");
const { createDpsAccountController, transactionDetailsController, getSpecificDetailsForDpsAccountController, withdrawController, withdrawDetailsController, makeDepositController } = require("../controller/dps/dpsController");
const dpsRoute = express.Router();

dpsRoute.post("/create", createDpsAccountController)
dpsRoute.get("/deposit-account/:id", getSpecificDetailsForDpsAccountController);
dpsRoute.post("/makeDeposit", makeDepositController);
dpsRoute.post("/makeWithdraw", withdrawController);
dpsRoute.get("/transaction/:id", transactionDetailsController);
dpsRoute.get("/withdraw/:id", withdrawDetailsController);
module.exports = dpsRoute;