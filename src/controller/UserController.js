const asyncHandler = require("express-async-handler");

const bcrypt = require("bcrypt");
const User = require("../model/User.Schema");

const createNewUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(404).json({ message: "All Fields are required" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { username: username, password: hashedPassword };
  const newUser2 = await User.create(newUser);

  if (newUser2) {
    return res.status(200).json({ message: "user created" });
  }
});

module.exports = {
  createNewUser,
};
