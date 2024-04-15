const Joi = require("joi");

const bankCashValidationSchema = Joi.object({
  branchId: Joi.string().required().messages({
    "any.required": "Branch ID is required",
    "string.base": "Branch ID must be a string",
  }),
  samityId: Joi.string().required().messages({
    "any.required": "Samity ID is required",
    "string.base": "Samity ID must be a string",
  }),
  bankId: Joi.string().required().messages({
    "any.required": "Bank ID is required",
    "string.base": "Bank ID must be a string",
  }),
  amount: Joi.number().required().messages({
    "any.required": "Amount is required",
    "number.base": "Amount must be a number",
  }),
  type: Joi.string().valid("cashIn", "cashOut").default("cashIn").messages({
    "any.only": 'Type must be either "cashIn" or "cashOut"',
    "string.base": "Type must be a string",
  }),
  date: Joi.date().required().default(new Date()).messages({
    "any.required": "Date is required",
    "date.base": "Date must be a valid date",
  }),
});

module.exports = bankCashValidationSchema;
