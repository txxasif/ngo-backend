const Joi = require("joi");

const employeeSchemaValidation = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "Name is required.",
    "string.base": "Name must be a string.",
  }),
  fatherName: Joi.string().required().messages({
    "any.required": "Father's name is required.",
    "string.base": "Father's name must be a string.",
  }),
  motherName: Joi.string().required().messages({
    "any.required": "Mother's name is required.",
    "string.base": "Mother's name must be a string.",
  }),
  presentAddress: Joi.string().required().messages({
    "any.required": "Present address is required.",
    "string.base": "Present address must be a string.",
  }),
  permanentAddress: Joi.string().required().messages({
    "any.required": "Permanent address is required.",
    "string.base": "Permanent address must be a string.",
  }),
  educationalQualification: Joi.string().required().messages({
    "any.required": "Educational qualification is required.",
    "string.base": "Educational qualification must be a string.",
  }),
  dateOfBirth: Joi.date().required().iso().messages({
    "any.required": "Date of birth is required.",
    "date.base": "Invalid date format. Please use YYYY-MM-DD.",
  }),
  mobileNumber: Joi.string().required().messages({
    "any.required": "Mobile number is required.",
    "string.base": "Mobile number must be a string.",
  }),
  email: Joi.string().email().allow("").messages({
    "string.email": "Invalid email address.",
  }),
  emergencyContactNumber: Joi.string().required().messages({
    "any.required": "Emergency contact number is required.",
    "string.base": "Emergency contact number must be a string.",
  }),
  religion: Joi.string().allow("").messages({
    "string.base": "Religion must be a string.",
  }),
  nidNumber: Joi.string().required().messages({
    "any.required": "NID number is required.",
    "string.base": "NID number must be a string.",
  }),
  photo: Joi.string().required().messages({
    "any.required": "Photo is required.",
    "string.base": "Photo must be a string.",
  }),
  branchId: Joi.string().required().messages({
    "any.required": "Branch name is required.",
    "string.base": "Branch name must be a string.",
  }),
  samityId: Joi.string().required().messages({
    "any.required": "Samity name is required.",
    "string.base": "Samity name must be a string.",
  }),
  previousOrganization: Joi.object({
    name: Joi.string().required().messages({
      "any.required": "Previous organization name is required.",
      "string.base": "Previous organization name must be a string.",
    }),
    address: Joi.string().required().messages({
      "any.required": "Previous organization address is required.",
      "string.base": "Previous organization address must be a string.",
    }),
    joiningDate: Joi.date().required().iso().messages({
      "any.required": "Previous organization joining date is required.",
      "date.base": "Invalid date format. Please use YYYY-MM-DD.",
    }),
    position: Joi.string().required().messages({
      "any.required": "Previous organization position is required.",
      "string.base": "Previous organization position must be a string.",
    }),
    salary: Joi.number().required().messages({
      "any.required": "Previous organization salary is required.",
      "number.base": "Previous organization salary must be a number.",
    }),
    switchReason: Joi.string().required().messages({
      "any.required": "Switch reason is required.",
      "string.base": "Switch reason must be a string.",
    }),
  })
    .required()
    .messages({
      "any.required": "Previous organization details are required.",
    }),
  presentPosition: Joi.object({
    designation: Joi.string().required().messages({
      "any.required": "Present position designation is required.",
      "string.base": "Present position designation must be a string.",
    }),
    dateOfJoining: Joi.date().required().iso().messages({
      "any.required": "Present position joining date is required.",
      "date.base": "Invalid date format. Please use YYYY-MM-DD.",
    }),
    salaryAmount: Joi.number().required().messages({
      "any.required": "Salary amount is required.",
      "number.base": "Salary amount must be a number.",
    }),
    mobileBill: Joi.number().required().messages({
      "any.required": "Mobile bill is required.",
      "number.base": "Mobile bill must be a number.",
    }),
    taDa: Joi.number().required().messages({
      "any.required": "TA/DA is required.",
      "number.base": "TA/DA must be a number.",
    }),
    additionalTotal: Joi.number().required().messages({
      "any.required": "Additional total is required.",
      "number.base": "Additional total must be a number.",
    }),
    employeeSecurityFund: Joi.number().required().messages({
      "any.required": "Employee security fund is required.",
      "number.base": "Employee security fund must be a number.",
    }),
  })
    .required()
    .messages({
      "any.required": "Present position details are required.",
    }),
  guarantorDetails: Joi.object({
    name: Joi.string().required().messages({
      "any.required": "Guarantor's name is required.",
      "string.base": "Guarantor's name must be a string.",
    }),
    address: Joi.string().required().messages({
      "any.required": "Guarantor's address is required.",
      "string.base": "Guarantor's address must be a string.",
    }),
    relation: Joi.string().required().messages({
      "any.required": "Guarantor's relation is required.",
      "string.base": "Guarantor's relation must be a string.",
    }),
    occupation: Joi.string().required().messages({
      "any.required": "Guarantor's occupation is required.",
      "string.base": "Guarantor's occupation must be a string.",
    }),
  })
    .required()
    .messages({
      "any.required": "Guarantor details are required.",
    }),
});

module.exports = employeeSchemaValidation;
