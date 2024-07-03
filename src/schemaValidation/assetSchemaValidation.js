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
  expenseName: Joi.string().allow("").messages({
    "string.base": "Expense name must be a string",
  }),
  description: Joi.string().allow("").messages({
    "string.base": "Description must be a string",
  }),
  unitAmount: Joi.number().messages({
    "number.base": "Unit amount must be a number",
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
  totalPayment: Joi.number().messages({
    "number.base": "Total payment must be a number",
  }),
  status: Joi.string().valid("paid", "unpaid").required().messages({
    "any.required": "Status is required",
    "string.base": "Status must be a string",
    "any.only": 'Status must be either "paid" or "unpaid"',
  }),
  remarks: Joi.string().allow("").messages({
    "string.base": "Remarks must be a string",
  }),
});

module.exports = assetValidationSchema;
