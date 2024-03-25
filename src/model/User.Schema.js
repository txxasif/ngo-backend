const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
}).plugin(AutoIncrement, {
  inc_field: "userId",
  id: "ticketNums",
  start_seq: 500,
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
module.exports = User;
