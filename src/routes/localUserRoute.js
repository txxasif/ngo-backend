const express = require("express");
const {
  addLocalUserController,
} = require("../controller/localUser/localUserController");
const localUserRoute = express.Router();

localUserRoute.post("/add", addLocalUserController);
// localUserRoute.get("/all", getAllBranchController);

module.exports = localUserRoute;
