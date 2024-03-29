const Joi = require("joi");
const localUserSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "Name is required",
    "string.empty": "Name must not be empty",
  }),
  fromAdmin: Joi.boolean().required().messages({
    "any.required": "fromAdmin field is required",
  }),
  branchId: Joi.string().required().messages({
    "any.required": "Branch ID is required",
  }),
  samityId: Joi.string().required().messages({
    "any.required": "Samity ID is required",
  }),
  fathersName: Joi.string().required().messages({
    "any.required": "Father's name is required",
    "string.empty": "Father's name must not be empty",
  }),
  mothersName: Joi.string().required().messages({
    "any.required": "Mother's name is required",
    "string.empty": "Mother's name must not be empty",
  }),
  spouseName: Joi.string().required().messages({
    "any.required": "Spouse's name is required",
    "string.empty": "Spouse's name must not be empty",
  }),
  occupation: Joi.string().required().messages({
    "any.required": "Occupation is required",
    "string.empty": "Occupation must not be empty",
  }),
  occupationBrief: Joi.string().required().messages({
    "any.required": "Occupation brief is required",
    "string.empty": "Occupation brief must not be empty",
  }),
  presentAddress: Joi.string().required().messages({
    "any.required": "Present address is required",
    "string.empty": "Present address must not be empty",
  }),
  permanentAddress: Joi.string().required().messages({
    "any.required": "Permanent address is required",
    "string.empty": "Permanent address must not be empty",
  }),
  educationalQualification: Joi.string().messages({
    "any.required": "Educational qualification is required",
    "string.empty": "Educational qualification must not be empty",
  }),
  dateOfBirth: Joi.date().required().messages({
    "any.required": "Date of birth is required",
  }),
  nidNumber: Joi.string().required().messages({
    "any.required": "NID number is required",
    "string.empty": "NID number must not be empty",
  }),
  mobileNumber: Joi.string().required().messages({
    "any.required": "Mobile number is required",
    "string.empty": "Mobile number must not be empty",
  }),
  emergencyContactNumber: Joi.string().required().messages({
    "any.required": "Emergency contact number is required",
    "string.empty": "Emergency contact number must not be empty",
  }),
  religion: Joi.string().required().messages({
    "any.required": "Religion is required",
    "string.empty": "Religion must not be empty",
  }),
  membershipFee: Joi.number().required().messages({
    "any.required": "Membership fee is required",
  }),
  photo: Joi.string().required().messages({
    "any.required": "Photo is required",
    "string.empty": "Photo must not be empty",
  }),
  status: Joi.string().valid("Active", "Deactive").required().messages({
    "any.required": "Status is required",
    "string.empty": "Status must not be empty",
    "any.only": "Status must be either Active or Deactive",
  }),
  nominee: Joi.object({
    name: Joi.string().required().messages({
      "any.required": "Nominee name is required",
      "string.empty": "Nominee name must not be empty",
    }),
    address: Joi.string().required().messages({
      "any.required": "Nominee address is required",
      "string.empty": "Nominee address must not be empty",
    }),
    relation: Joi.string().required().messages({
      "any.required": "Nominee relation is required",
      "string.empty": "Nominee relation must not be empty",
    }),
    share: Joi.number().min(0).max(100).required().messages({
      "any.required": "Nominee share is required",
      "number.base": "Nominee share must be a number",
      "number.min": "Nominee share must be at least 0",
      "number.max": "Nominee share must be at most 100",
    }),
    occupation: Joi.string().required().messages({
      "any.required": "Nominee occupation is required",
      "string.empty": "Nominee occupation must not be empty",
    }),
  }).required(),
}).required();
module.exports = localUserSchema;
