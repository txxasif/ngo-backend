const Joi = require("joi");

const depositAccountSchema = Joi.object({
  memberId: Joi.string().required().messages({
    "any.required": "Member ID is required.",
    "string.base": "Member ID must be a string.",
  }),
  branchId: Joi.string().required().messages({
    "any.required": "Branch ID is required.",
    "string.base": "Branch ID must be a string.",
  }),
  samityId: Joi.string().required().messages({
    "any.required": "Samity ID is required.",
    "string.base": "Samity ID must be a string.",
  }),
  paymentTerm: Joi.string()
    .valid(
      "Daily",
      "Weekly",
      "Fortnightly",
      "Monthly",
      "Quarterly",
      "Half-Yearly",
      "Yearly"
    )
    .required()
    .messages({
      "any.required": "Payment term is required.",
      "any.only": "Invalid payment term.",
    }),
  periodOfTimeInMonths: Joi.number().integer().positive().required().messages({
    "any.required": "Period of time in months must be provided.",
    "number.base": "Period of time in months must be a number.",
    "number.integer": "Period of time in months must be an integer.",
    "number.positive": "Period of time in months must be a positive integer.",
  }),
  perInstallment: Joi.number().positive().required().messages({
    "any.required": "Per installment amount is required.",
    "number.base": "Per installment amount must be a number.",
    "number.positive": "Per installment amount must be a positive number.",
  }),
  profitPercentage: Joi.number().positive().required().messages({
    "any.required": "Profit percentage is required.",
    "number.base": "Profit percentage must be a number.",
    "number.positive": "Profit percentage must be a positive number.",
  }),
  onMatureAmount: Joi.number().positive().required().messages({
    "any.required": "On mature amount is required.",
    "number.base": "On mature amount must be a number.",
    "number.positive": "On mature amount must be a positive number.",
  }),
  openingDate: Joi.date().required().messages({
    "any.required": "Opening date is required.",
    "date.base": "Opening date must be a valid date.",
  }),
  matureDate: Joi.date().required().messages({
    "any.required": "Mature date is required.",
    "date.base": "Mature date must be a valid date.",
  }),
  // firstDueDate: Joi.date().required().message('First due date is required.'),
  transactions: Joi.array().items(Joi.object()).optional(),
  withdraws: Joi.array().items(Joi.object()).optional(),
  balance: Joi.number().optional().messages({
    "number.base": "Balance must be a number.",
  }),
  isOpen: Joi.boolean().optional().messages({
    "boolean.base": "isOpen must be a boolean.",
  }),
});

module.exports = { depositAccountSchema };
