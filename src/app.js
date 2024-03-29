const express = require("express");
const app = express();
const path = require("path");

const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const morgan = require("morgan");
const userRoute = require("./routes/userRoute");
const userAuthRoute = require("./routes/authRoute");
const branchRoute = require("./routes/branchRoute");
const samityRoute = require("./routes/samityRoute");
const localUserRoute = require("./routes/localUserRoute");
app.use(cors());
app.use(morgan("combined"));
app.use("/", express.static(path.join(__dirname, "/public")));
app.use(express.json());

app.use("/user", userRoute);
app.use("/auth", userAuthRoute);

app.use("/branch", branchRoute);
app.use("/samity", samityRoute);
app.use("/localuser", localUserRoute);

app.all("*", (req, res) => {
  res.status(404);
  res.json({ message: "404 Not Found" });
});
module.exports = app;
