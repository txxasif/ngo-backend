const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const Admin = require("../model/AdminSchema");

const createNewAdminController = asyncHandler(async (req, res) => {
  const { phoneNumber, password, name } = req.body;
  if (!phoneNumber || !password || !name) {
    return res.status(404).json({ message: "All Fields are required" });
  }
  const isAdminExist = await Admin.findOne({ phoneNumber: phoneNumber });
  if (isAdminExist) {
    return res
      .status(400)
      .json({ message: " A user with the same Phone Number  already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { phoneNumber, name, password: hashedPassword };
  const newUser2 = await Admin.create(newUser);

  if (newUser2) {
    return res.status(200).json({ message: "user created" });
  }
});

module.exports = {
  createNewAdminController,
};
