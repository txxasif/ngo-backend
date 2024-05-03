const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../model/User.Schema");
const jwt = require("jsonwebtoken");
const Admin = require("../model/AdminSchema");
const Employee = require("../model/EmployeeSchema");

const loginHandler = asyncHandler(async (req, res) => {
  const { phoneNumber, password, type } = req.body;
  if (!phoneNumber || !password || !type) {
    return res.status(400).json({ message: "All Fields are required." });
  }
  if (type === "admin") {
    const foundUser = await Admin.findOne({ phoneNumber: phoneNumber });
    if (!foundUser) {
      return res.status(404).json({ message: "No Admin found." });
    }
    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) {
      return res.status(404).json({ message: " passwords do not match." });
    }
    return res.json({ type: "admin" });
  } else if (type === "collector") {
    const foundUser = await Employee.findOne({ mobileNumber: phoneNumber });
    if (!foundUser) {
      return res.status(404).json({ message: "No Collector found." });
    }
    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) {
      return res.status(404).json({ message: " passwords do not match." });
    }
    return res.json({ type: "collector" });
  }
});

const refreshAccessTokenController = (req, res) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token is required" });
  }

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const foundUser = await User.findOne({
        username: decoded.username,
      }).exec();

      if (!foundUser) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: foundUser.username,
            roles: foundUser.roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );

      res.json({ accessToken });
    }
  );
};

module.exports = {
  loginHandler,
  refreshAccessTokenController,
};
