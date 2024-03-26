const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../model/User.Schema");
const jwt = require("jsonwebtoken");

const loginHandler = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const foundUser = await User.findOne({ username: username }).exec();
  if (!foundUser) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const match = await bcrypt.compare(password, foundUser.password);
  if (!match) return res.status(401).json({ message: "Unauthorized" });
  const accessToken = jwt.sign(
    {
      UserInfo: {
        username: foundUser.username,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    {
      UserInfo: {
        username: foundUser.username,
      },
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
  return res.json({ username: foundUser.username, accessToken, refreshToken });
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
