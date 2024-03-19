const http = require("http");
const app = require("./app");
const mongoose = require("mongoose");
const server = http.createServer(app);
const mongodb_url =
  "mongodb+srv://agrobd:Asif8377@agrobd.joapcha.mongodb.net/ngo?retryWrites=true&w=majority";
mongoose.connection.once("open", () => {
  console.log("done");
});
mongoose.connection.once("error", (err) => {
  console.log(err);
});
async function startServer() {
  await mongoose.connect(mongodb_url).then(() => {
    console.log("done");
  });
  server.listen(5000);
}
startServer();
