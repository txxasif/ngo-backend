const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  samityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Samity",
    required: true,
  },
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  presentEmployees: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
      },
    ],
    default: [], // Set default value to an empty array
  },
});

const Attendance =
  mongoose.models.Attendance || mongoose.model("Attendance", attendanceSchema);
module.exports = Attendance;
