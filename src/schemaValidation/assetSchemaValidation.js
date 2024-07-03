const Joi = require("joi");

const assetValidationSchema = Joi.object({
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
    "any.required": "Head ID is required",
    "string.hex": "Head ID must be a hexadecimal value",
    "string.length": "Head ID must be exactly 24 characters long",
  }),

  unitAmount: Joi.number().messages({
    "number.base": "Unit amount must be a number",
  }),
  appreciation: Joi.number().messages({
    "number.base": "Appreciation Percentage must be a number",
  }),
  depreciation: Joi.number().messages({
    "number.base": "Depreciation Percentage must be a number",
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
  unitPrice: Joi.number().messages({
    "number.base": "Unit price must be a number",
  }),
  tds: Joi.number().messages({
    "number.base": "TDS must be a number",
  }),
  tax: Joi.number().messages({
    "number.base": "Tax must be a number",
  }),
  date: Joi.date().required().messages({
    "any.required": "Date is required",
    "date.base": "Date must be a valid date",
  }),
  vat: Joi.number().messages({
    "number.base": "VAT must be a number",
  }),
  total: Joi.number().messages({
    "number.base": "Total payment must be a number",
  }),

  remarks: Joi.string().allow("").messages({
    "string.base": "Remarks must be a string",
  }),
});

module.exports = assetValidationSchema;
