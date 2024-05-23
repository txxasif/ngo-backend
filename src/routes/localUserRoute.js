const express = require("express");
const {
  getUsersByBranchAndSamityId,
  addLocalUserController,
  getUserByPhoneNumberController,
  updateUserDetailsController,
  localUserPendingListController,
  acceptUserRequestController
} = require("../controller/localUser/localUserController");
const { verifyJwtBoth } = require("../middleware/verifyJWT");
const localUserRoute = express.Router();

localUserRoute.get("/all", verifyJwtBoth, getUsersByBranchAndSamityId);
localUserRoute.post("/add", addLocalUserController);
localUserRoute.put("/update/:id", updateUserDetailsController);
localUserRoute.get("/pending",localUserPendingListController);
localUserRoute.get("/accept/:id", acceptUserRequestController);
localUserRoute.get("/:id", getUserByPhoneNumberController);

module.exports = localUserRoute;
