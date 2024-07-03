const Joi = require("joi");

const expenseValidationSchema = Joi.object({
  branchId: Joi.string().hex().length(24).required().messages({
    "any.required": "Branch ID is required",
    "string.hex": "Branch ID must be a hexadecimal value",
    "string.length": "Branch ID must be exactly 24 characters long",
  }),
  samityId: Joi.string().hex().length(24).required().messages({
    "any.required": "Samity ID is required",
    "string.hex": "Samity ID must be a hexadecimal value",
    "string.length": "Samity ID must be exactly 24 characters long",
  }),
  headId: Joi.string().hex().length(24).required().messages({
    "any.required": "Samity ID is required",
    "string.hex": "Samity ID must be a hexadecimal value",
    "string.length": "Samity ID must be exactly 24 characters long",
  }),
  date: Joi.date().required().messages({
    "any.required": "Date is required",
    "date.base": "Date must be a valid date",
  }),
  amount: Joi.number().required().messages({
    "any.required": "Amount  is required",
    "number.base": "Amount  must be a number",
  }),
  by: Joi.object({
    name: Joi.string().required().messages({
      "any.required": "Name is required.",
    }),
    phone: Joi.string().required().messages({
      "any.required": "Phone is required.",
    }),
    type: Joi.string().required().messages({
      "any.required": "Type is required.",
    }),
  }).required().messages({
    "object.unknown": "Field {{#label}} is not allowed.",
    "any.custom": "{{#label}} is invalid.",
  }),

  remarks: Joi.string().allow("").messages({
    "string.base": "Remarks must be a string",
  }),
});

module.exports = expenseValidationSchema;
