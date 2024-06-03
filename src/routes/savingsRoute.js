const express = require("express");
const { createSavingsAccountController } = require("../controller/savings/savingsController");
const savingsRoute = express.Router();

savingsRoute.post("/create", createSavingsAccountController)
module.exports = savingsRoute;