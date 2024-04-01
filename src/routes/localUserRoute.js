const express = require("express");
const {
  getUsersByBranchAndSamityId,
  addLocalUserController,
  getUserByPhoneNumberController,
} = require("../controller/localUser/localUserController");
const localUserRoute = express.Router();

localUserRoute.get("/all", getUsersByBranchAndSamityId);
localUserRoute.post("/add", addLocalUserController);
localUserRoute.get("/:id", getUserByPhoneNumberController);

// localUserRoute.get("/all", getAllBranchController);

module.exports = localUserRoute;
