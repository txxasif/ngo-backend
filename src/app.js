const express = require("express");
const app = express();

const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
//app.use(morgan("combined"));
app.use(express.json());
app.get("/", async function (req, res) {
  return res.send({ msg: "done" });
});

module.exports = app;
