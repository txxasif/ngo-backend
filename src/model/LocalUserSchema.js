const mongoose = require("mongoose");

const nidDetailsSchema = new mongoose.Schema({
  nidNumber: String,
  nidPhotoFront: String, // URL to the front photo of the NID
  nidPhotoBack: String   // URL to the back photo of the NID
});

const birthCertificateSchema = new mongoose.Schema({
  birthCertificateNumber: String,
  photo: String // URL to the photo of the birth certificate
});

const nomineeSchema = new mongoose.Schema({
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
  occupation: String,
  phoneNumber: String,
  photo: String, // URL to the nominee's photo
  birthCertificate: birthCertificateSchema,
  nidDetails: nidDetailsSchema
});

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
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
  fathersName: String,
  mothersName: String,
  spouseName: String,
  occupation: String,
  occupationBrief: String,
  presentAddress: {
    type: String,
    required: true,
  },
  permanentAddress: String,
  educationalQualification: String,
  dateOfBirth: Date,
  nidNumber: {
    type: String,
    unique: true,
  },
  mobileNumber: {
    type: String,
    required: true,
    index: true,
  },
  emergencyContactNumber: String,
  religion: String,
  membershipFee: Number,
  formFee: Number,
  memberSalary: Number,
  photo: String, // URL to the member's photo
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
  },
  nidDetails: nidDetailsSchema,
  birthCertificate: birthCertificateSchema,
  nominee: nomineeSchema,
  referenceSection: {
    employeeName: String,
    employeeNumber: String
  }
});

const LocalUser = mongoose.models.LocalUser || mongoose.model("LocalUser", memberSchema);

module.exports = LocalUser;
