const mongoose = require("mongoose");
const { Schema } = mongoose;

const employeeSchema = new Schema({
  name: String,
  fatherName: String,
  motherName: String,
  presentAddress: String,
  permanentAddress: String,
  password: String,
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
  mobileNumber: String,
  email: String,
  emergencyContactNumber: String,
  religion: String,
  nidNumber: String,
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
  guarantorDetails: {
    name: String,
    address: String,
    relation: String,
    occupation: String,
  },
});

const Employee =
  mongoose.models.Employee || mongoose.model("Employee", employeeSchema);

module.exports = Employee;
