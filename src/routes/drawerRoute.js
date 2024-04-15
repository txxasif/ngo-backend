const express = require("express");
const {
  addDrawerCashInOutController,
} = require("../controller/drawerCash/drawerCashController");
const drawerRoute = express.Router();

drawerRoute.post("/add", addDrawerCashInOutController);

module.exports = drawerRoute;
