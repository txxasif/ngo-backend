const express = require("express");
const { createDpsAccountController } = require("../controller/dps/dpsController");
const dpsRoute = express.Router();

dpsRoute.post("/create", createDpsAccountController)
module.exports = dpsRoute;