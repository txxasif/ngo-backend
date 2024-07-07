const mongoose = require("mongoose");
const { Schema } = mongoose;
const nidDetailsSchema = new mongoose.Schema({
  nidNumber: String,
  nidPhotoFront: String, // URL to the front photo of the NID
  nidPhotoBack: String   // URL to the back photo of the NID
});
const employeeSchema = new Schema({
  name: String,
  fatherName: String,
  motherName: String,
  presentAddress: String,
  permanentAddress: String,
  password: String,
  nidDetails: nidDetailsSchema,
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
  educationalQualification: String,
  dateOfBirth: Date,
  mobileNumber: {
    type: Number,
    index: true,

  },
  email: String,
  emergencyContactNumber: String,
  religion: String,
  photo: String,
  previousOrganization: {
    name: String,
    address: String,
    joiningDate: Date,
    position: String,
    salary: Number,
    switchReason: String,
  },
  presentPosition: {
    designation: String,
    dateOfJoining: Date,
    salaryAmount: Number,
    mobileBill: Number,
    taDa: Number,
    additionalTotal: Number,
    employeeSecurityFund: Number,
  },
  salaryDue: {
    type: Number,
    default: 0,
  },
  leaveDays: {
    type: Number,
    default: 0,
  },
  guarantorDetails: {
    name: String,
    address: String,
    relation: String,
    occupation: String,
    nidDetails: nidDetailsSchema
  },
});

const Employee =
  mongoose.models.Employee || mongoose.model("Employee", employeeSchema);

module.exports = Employee;
