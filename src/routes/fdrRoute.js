const express = require("express");
const { createFdrAccountController } = require("../controller/fdr/fdrController");
const fdrRoute = express.Router();

fdrRoute.post("/create", createFdrAccountController)
module.exports = fdrRoute;