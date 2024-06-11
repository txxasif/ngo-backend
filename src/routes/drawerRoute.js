const express = require("express");
const {
  addDrawerCashInOutController, samityDrawerCashDetailsController, getDrawerCashDetailsBySamityIdController
} = require("../controller/drawerCash/drawerCashController");
const drawerRoute = express.Router();

drawerRoute.post("/add", addDrawerCashInOutController);
drawerRoute.get("/details", samityDrawerCashDetailsController);
drawerRoute.get("/samity/:id", getDrawerCashDetailsBySamityIdController);

module.exports = drawerRoute;
