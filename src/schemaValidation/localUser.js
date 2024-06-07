const Joi = require("joi");
const nidDetailsSchema = Joi.object({
  nidNumber: Joi.string().required().messages({
    'string.base': 'NID number must be a string',
    'any.required': 'NID number is required'
  }),
  nidPhotoFront: Joi.string().uri().required().messages({
    'string.uri': 'Front NID photo must be a valid URL',
    'any.required': 'Front NID photo is required'
  }),
  nidPhotoBack: Joi.string().uri().required().messages({
    'string.uri': 'Back NID photo must be a valid URL',
    'any.required': 'Back NID photo is required'
  })
}).messages({
  'object.base': 'NID details must be an object'
});

const birthCertificateSchema = Joi.object({
  birthCertificateNumber: Joi.string().required().messages({
    'string.base': 'Birth certificate number must be a string',
    'any.required': 'Birth certificate number is required'
  }),
  photo: Joi.string().uri().required().messages({
    'string.uri': 'Birth certificate photo must be a valid URL',
    'any.required': 'Birth certificate photo is required'
  })
}).messages({
  'object.base': 'Birth certificate details must be an object'
});

const nomineeSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'Nominee name is required',
    'string.base': 'Nominee name must be a string'
  }),
  address: Joi.string().required().messages({
    'any.required': 'Nominee address is required',
    'string.base': 'Nominee address must be a string'
  }),
  relation: Joi.string().required().messages({
    'any.required': 'Nominee relation is required',
    'string.base': 'Nominee relation must be a string'
  }),
  share: Joi.number().min(0).max(100).messages({
    'number.base': 'Nominee share must be a number',
    'number.min': 'Nominee share must be at least 0',
    'number.max': 'Nominee share must be at most 100'
  }),
  occupation: Joi.string().allow(null, '').messages({
    'string.base': 'Nominee occupation must be a string',
  }),
  phoneNumber: Joi.string().allow(null, '').messages({
    'string.base': 'Nominee phone number must be a string',
  }),
  photo: Joi.string().uri().required().messages({
    'any.required': 'Nominee photo is required',
    'string.uri': 'Nominee photo must be a valid URL'
  }),
  birthCertificate: birthCertificateSchema,
  nidDetails: nidDetailsSchema
}).xor('birthCertificate', 'nidDetails').messages({
  'object.xor': 'Either nominee birth certificate or NID details must be provided, but not both'
});

const localUserSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'Name is required',
    'string.base': 'Name must be a string'
  }),
  branchId: Joi.string().required().messages({
    'any.required': 'Branch ID is required',
    'string.base': 'Branch ID must be a string'
  }),
  samityId: Joi.string().required().messages({
    'any.required': 'Samity ID is required',
    'string.base': 'Samity ID must be a string'
  }),
  fathersName: Joi.string().allow(null, '').messages({
    'string.base': 'Father\'s name must be a string'
  }),
  mothersName: Joi.string().allow(null, '').messages({
    'string.base': 'Mother\'s name must be a string'
  }),
  spouseName: Joi.string().allow(null, '').messages({
    'string.base': 'Spouse\'s name must be a string'
  }),
  occupation: Joi.string().allow(null, '').messages({
    'string.base': 'Occupation must be a string'
  }),
  occupationBrief: Joi.string().allow(null, '').messages({
    'string.base': 'Occupation brief must be a string'
  }),
  presentAddress: Joi.string().required().messages({
    'any.required': 'Present address is required',
    'string.base': 'Present address must be a string'
  }),
  permanentAddress: Joi.string().allow(null, '').messages({
    'string.base': 'Permanent address must be a string'
  }),
  educationalQualification: Joi.string().allow(null, '').messages({
    'string.base': 'Educational qualification must be a string'
  }),
  dateOfBirth: Joi.date().allow(null, '').messages({
    'date.base': 'Date of birth must be a valid date'
  }),
  openingDate: Joi.date().allow(null, '').messages({
    'date.base': 'Date of birth must be a valid date'
  }),

  mobileNumber: Joi.string().required().messages({
    'any.required': 'Mobile number is required',
    'string.base': 'Mobile number must be a string'
  }),
  emergencyContactNumber: Joi.string().allow(null, '').messages({
    'string.base': 'Emergency contact number must be a string'
  }),
  religion: Joi.string().allow(null, '').messages({
    'string.base': 'Religion must be a string'
  }),
  membershipFee: Joi.number().allow(null, '').messages({
    'number.base': 'Membership fee must be a number'
  }),
  formFee: Joi.number().allow(null, '').messages({
    'number.base': 'Form fee must be a number'
  }),
  memberSalary: Joi.number().allow(null, '').messages({
    'number.base': 'Member salary must be a number'
  }),
  photo: Joi.string().uri().required().messages({
    'any.required': 'Photo is required',
    'string.uri': 'Photo must be a valid URL'
  }),
  status: Joi.string().valid("pending", "accepted", "rejected").messages({
    'any.only': 'Status must be one of "pending", "accepted", or "rejected"'
  }),
  nidDetails: nidDetailsSchema,
  birthCertificate: birthCertificateSchema,
  nominee: nomineeSchema,
  referenceSection: Joi.object({
    employeeName: Joi.string().allow(null, '').messages({
      'string.base': 'Employee name must be a string'
    }),
    employeeNumber: Joi.string().allow(null, '').messages({
      'string.base': 'Employee number must be a string'
    })
  }).allow(null, '').messages({
    'object.base': 'Reference section must be an object'
  })
}).xor('nidDetails', 'birthCertificate').messages({
  'object.xor': 'Either birth certificate or NID details must be provided, but not both'
});
module.exports = localUserSchema;
