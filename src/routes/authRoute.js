const express = require("express");
const {
  loginHandler,
  refreshAccessTokenController,
} = require("../controller/userAuthController");
const loginLimiter = require("../middleware/loginLimiter");

const userAuthRoute = express.Router();

userAuthRoute.post("/user", loginLimiter, loginHandler);
userAuthRoute.post("/refresh", refreshAccessTokenController);

module.exports = userAuthRoute;
