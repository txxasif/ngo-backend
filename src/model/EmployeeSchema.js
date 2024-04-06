const mongoose = require("mongoose");
const { Schema } = mongoose;

const employeeSchema = new Schema({
  name: String,
  fatherName: String,
  motherName: String,
  presentAddress: String,
  permanentAddress: String,
  educationalQualification: String,
  dateOfBirth: Date, // Assuming dateOfBirth is a date
  mobileNumber: String,
  email: String,
  emergencyContactNumber: String,
  religion: String,
  nidNumber: String,
  photo: String,
  previousOrganization: {
    name: String,
    address: String,
    joiningDate: Date, // Assuming joiningDate is a date
    position: String,
    salary: Number,
    switchReason: String,
  },
  presentPosition: {
    designation: String,
    dateOfJoining: Date, // Assuming dateOfJoining is a date
    branchName: String,
    samityName: String,
    salaryAmount: Number,
    mobileBill: Number,
    taDa: Number,
    additionalTotal: Number,
    employeeSecurityFund: Number,
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
