require("dotenv").config();
const http = require("http");
const app = require("./app");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConnection");
const server = http.createServer(app);
const port = process.env.PORT || 5000;


connectDB();

mongoose.connection.once("open", () => {
  console.log("done");
  server.listen(port);
});
mongoose.connection.on("error", (err) => {
  console.log(err);
});


