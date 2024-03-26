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

const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  fathersName: {
    type: String,
  },
  mothersName: {
    type: String,
  },
  spouseName: {
    type: String,
  },
  occupation: {
    type: String,
  },
  occupationBrief: {
    type: String,
  },
  presentAddress: {
    type: String,
    required: true,
  },
  permanentAddress: {
    type: String,
  },
  educationalQualification: {
    type: String,
  },
  dateOfBirth: {
    type: Date,
  },
  nidNumber: {
    type: String,
    unique: true, // Ensures no duplicate NID numbers
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  emergencyContactNumber: {
    type: String,
  },
  religion: {
    type: String,
  },
  membershipFee: {
    type: Number,
  },
  photo: {
    type: String, // Path to the stored image or reference to the image data
  },
  status: {
    type: String,
    enum: ["Active", "Deactive"],
    default: "Active",
  },
  nominee: {
    type: {
      name: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      relation: {
        type: String,
        required: true,
      },
      share: {
        type: Number,
        min: 0,
        max: 100, // Ensures share percentage is between 0 and 100
      },
      occupation: {
        type: String,
      },
    },
  },
});

module.exports = mongoose.model("Member", memberSchema);
