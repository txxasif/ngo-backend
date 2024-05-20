const express = require("express");
const {
  getUsersByBranchAndSamityId,
  addLocalUserController,
  getUserByPhoneNumberController,
  updateUserDetailsController,
} = require("../controller/localUser/localUserController");
const { verifyJwtBoth } = require("../middleware/verifyJWT");
const localUserRoute = express.Router();

localUserRoute.get("/all", verifyJwtBoth, getUsersByBranchAndSamityId);
localUserRoute.post("/add", addLocalUserController);
localUserRoute.put("/update/:id", updateUserDetailsController);
localUserRoute.get("/:id", getUserByPhoneNumberController);

// localUserRoute.get("/all", getAllBranchController);

module.exports = localUserRoute;
