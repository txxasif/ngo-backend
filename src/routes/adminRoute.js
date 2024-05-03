const express = require("express");
const { createNewAdminController } = require("../controller/UserController");
const adminRoute = express.Router();

adminRoute.post("/create", createNewAdminController);

module.exports = adminRoute;
