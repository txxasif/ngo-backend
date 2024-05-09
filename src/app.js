const express = require("express");
const app = express();
const path = require("path");

const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const morgan = require("morgan");
const userAuthRoute = require("./routes/authRoute");
const branchRoute = require("./routes/branchRoute");
const samityRoute = require("./routes/samityRoute");
const localUserRoute = require("./routes/localUserRoute");
const depositRoute = require("./routes/depositRoute");
const loanRoute = require("./routes/loanRoute");
const employeeRoute = require("./routes/employeeRoute");
const expenseRoute = require("./routes/expenseRoute");
const bankRoute = require("./routes/bankRoute");
const drawerRoute = require("./routes/drawerRoute");
const sitemap = require("express-sitemap-html");
const prayingAmountRoute = require("./routes/prayingAmountRoute");
const paySlipRoute = require("./routes/paySlipRoute");
const assetRoute = require("./routes/assetRoute");
const adminRoute = require("./routes/adminRoute");
const liabilitiesRoute = require("./routes/liabilitiesRoute");

app.use(cors());
app.use(morgan("combined"));
app.use("/", express.static(path.join(__dirname, "/public")));
app.use(express.json());

app.use("/admin", adminRoute);
app.use("/auth", userAuthRoute);

app.use("/branch", branchRoute);
app.use("/samity", samityRoute);
app.use("/localuser", localUserRoute);
app.use("/deposit", depositRoute);
app.use("/loan", loanRoute);
app.use("/employee", employeeRoute);
app.use("/expense", expenseRoute);
app.use("/bank", bankRoute);
app.use("/drawer", drawerRoute);
app.use("/praying-application", prayingAmountRoute);
app.use("/pay-slip", paySlipRoute);
app.use("/asset", assetRoute);
app.use("/liabilities", liabilitiesRoute);
app.get("/api-docs", sitemap(app));
app.all("*", (req, res) => {
  res.status(404);
  res.json({ message: "404 Not Found" });
});
module.exports = app;
