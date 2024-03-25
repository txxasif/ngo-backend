const express = require("express");
const { createNewUser } = require("../controller/UserController");
const userRoute = express.Router();

userRoute.post("/create", createNewUser);
userRoute.post("/login");

module.exports = userRoute;
