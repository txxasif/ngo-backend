const Joi = require("joi");

const ngoLoanSchemaValidation = Joi.object({
  institute: Joi.string().required().messages({
    "any.required": "Institute is required.",
    "string.empty": "Institute cannot be empty.",
  }),
  nameOfInstitute: Joi.string().required().messages({
    "any.required": "Name of Institute is required.",
    "string.empty": "Name of Institute cannot be empty.",
  }),
  durationInMonth: Joi.number().integer().min(1).required().messages({
    "any.required": "Duration in months is required.",
    "number.base": "Duration must be a number.",
    "number.integer": "Duration must be an integer.",
    "number.min": "Duration must be at least 1 month.",
  }),
  interestRate: Joi.number().min(0).required().messages({
    "any.required": "Interest rate is required.",
    "number.base": "Interest rate must be a number.",
    "number.min": "Interest rate cannot be negative.",
  }),
  amount: Joi.number().min(0).required().messages({
    "any.required": "Amount is required.",
    "number.base": "Amount must be a number.",
    "number.min": "Amount cannot be negative.",
  }),
  totalAmount: Joi.number().min(0).required().messages({
    "any.required": "Total amount is required.",
    "number.base": "Total amount must be a number.",
    "number.min": "Total amount cannot be negative.",
  }),
  perInstallment: Joi.number().min(0).required().messages({
    "any.required": "Per installment amount is required.",
    "number.base": "Per installment amount must be a number.",
    "number.min": "Per installment amount cannot be negative.",
  }),
  remark: Joi.string().allow("").messages({
    "string.empty": "Remark must be a string.",
  }),
});

module.exports = ngoLoanSchemaValidation;
