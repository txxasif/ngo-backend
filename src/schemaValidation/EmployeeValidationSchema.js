const Joi = require("joi");

const customMessages = {
  string: {
    base: "{#label} must be a string",
    empty: "{#label} cannot be empty",
    min: "{#label} should have a minimum length of {#limit}",
    max: "{#label} should have a maximum length of {#limit}",
    email: "{#label} must be a valid email",
  },
  number: {
    base: "{#label} must be a number",
    empty: "{#label} cannot be empty",
    min: "{#label} should be greater than or equal to {#limit}",
    max: "{#label} should be less than or equal to {#limit}",
  },
  date: {
    base: "{#label} must be a valid date",
    empty: "{#label} cannot be empty",
  },
};

const employeeSchemaValidation = Joi.object({
  name: Joi.string().required().messages(customMessages.string),
  fatherName: Joi.string().required().messages(customMessages.string),
  motherName: Joi.string().required().messages(customMessages.string),
  presentAddress: Joi.string().required().messages(customMessages.string),
  permanentAddress: Joi.string().required().messages(customMessages.string),
  educationalQualification: Joi.string()
    .required()
    .messages(customMessages.string),
  dateOfBirth: Joi.date().required().messages(customMessages.date),
  mobileNumber: Joi.string().required().messages(customMessages.string),
  email: Joi.string().email().required().messages(customMessages.string),
  emergencyContactNumber: Joi.string()
    .required()
    .messages(customMessages.string),
  religion: Joi.string().required().messages(customMessages.string),
  nidNumber: Joi.string().required().messages(customMessages.string),
  photo: Joi.string().required().messages(customMessages.string),
  previousOrganization: Joi.object({
    name: Joi.string().required().messages(customMessages.string),
    address: Joi.string().required().messages(customMessages.string),
    joiningDate: Joi.date().required().messages(customMessages.date),
    position: Joi.string().required().messages(customMessages.string),
    salary: Joi.number().required().messages(customMessages.number),
    switchReason: Joi.string().required().messages(customMessages.string),
  }),
  presentPosition: Joi.object({
    designation: Joi.string().required().messages(customMessages.string),
    dateOfJoining: Joi.date().required().messages(customMessages.date),
    branchName: Joi.string().required().messages(customMessages.string),
    samityName: Joi.string().required().messages(customMessages.string),
    salaryAmount: Joi.number().required().messages(customMessages.number),
    mobileBill: Joi.number().required().messages(customMessages.number),
    taDa: Joi.number().required().messages(customMessages.number),
    additionalTotal: Joi.number().required().messages(customMessages.number),
    employeeSecurityFund: Joi.number()
      .required()
      .messages(customMessages.number),
  }),
  guarantorDetails: Joi.object({
    name: Joi.string().required().messages(customMessages.string),
    address: Joi.string().required().messages(customMessages.string),
    relation: Joi.string().required().messages(customMessages.string),
    occupation: Joi.string().required().messages(customMessages.string),
  }),
});

module.exports = employeeSchemaValidation;
