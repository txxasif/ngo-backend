const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
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
    const accessToken = jwt.sign(
      { role: "admin" },
      process.env.ADMIN_ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );
    const refreshToken = jwt.sign(
      { role: "admin" },
      process.env.ADMIN_REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    return res.json({id:foundUser._id, type: "admin", accessToken, refreshToken });
  } else if (type === "collector") {
    const foundUser = await Employee.findOne({ mobileNumber: phoneNumber });
    if (!foundUser) {
      return res.status(404).json({ message: "No Collector found." });
    }
    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) {
      return res.status(404).json({ message: " passwords do not match." });
    }
    const accessToken = jwt.sign(
      { role: "admin" },
      process.env.COLLECTOR_ACCESS_TOKEN_SECRET,
      { expiresIn: "3s" }
    );
    const refreshToken = jwt.sign(
      { role: "admin" },
      process.env.COLLECTOR_REFRESH_TOKEN_SECRET,
      { expiresIn: "10s" }
    );
    return res.json({id: foundUser._id, type: "collector", accessToken, refreshToken });
  }
});
const refreshAccessTokenController = asyncHandler(async (req, res) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token is required" });
  }
  const decode = jwt.decode(refreshToken);
  console.log(decode);
  if (!decode || !decode.role) {
    return res.status(403).json({ message: "Forbidden" });
  }

  function verifyJWT(token, role) {
    jwt.verify(refreshToken, token, (err, decode) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden" });
      }
      let accessToken =
        role === "admin"
          ? process.env.ADMIN_ACCESS_TOKEN_SECRET
          : process.env.COLLECTOR_ACCESS_TOKEN_SECRET;
      let newAccessToken = jwt.sign({ role: role }, accessToken, {
        expiresIn: "1h",
      });
      return res.json({ token: newAccessToken });
    });
  }
  let tempToken =
    decode.role === "admin"
      ? process.env.ADMIN_REFRESH_TOKEN_SECRET
      : process.env.COLLECTOR_REFRESH_TOKEN_SECRET;
  verifyJWT(tempToken, decode.role);
});

module.exports = {
  loginHandler,
  refreshAccessTokenController,
};
