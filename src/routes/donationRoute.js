const express = require("express");
const { createDonationController } = require("../controller/donation/donationController");
const donationRoute = express.Router();

donationRoute.post("/create", createDonationController);

module.exports = donationRoute;
