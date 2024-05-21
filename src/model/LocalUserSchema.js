const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  fromAdmin: {
    type: Boolean,
    required: true,
  },
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
    required: true,
  },
  samityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Samity",
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
    index: true,
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
        max: 100,
      },
      occupation: {
        type: String,
      },
    },
  },
});

const LocalUser =
  mongoose.models.LocalUser || mongoose.model("LocalUser", memberSchema);
module.exports = LocalUser;
