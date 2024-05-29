const Joi = require("joi");

const loanAccountValidationSchema = Joi.object({
  memberId: Joi.string().required().messages({
    "any.required": "Member ID is required.",
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
      "any.only": "Invalid payment term.",
      "any.required": "Payment term is required.",
    }),
  status: Joi.string()
    .valid(
      "pending",
      "approved",
      "closed",
    )
    .required()
    .messages({
      "any.only": "Invalid Status.",
      "any.required": "Status is Required.",
    }),
  loanAmount: Joi.number().required().messages({
    "any.required": "Loan amount is required.",
    "number.base": "Loan amount must be a number.",
  }),

  branchId: Joi.string().required().messages({
    "any.required": "Branch ID is required",
  }),
  samityId: Joi.string().required().messages({
    "any.required": "Samity ID is required",
  }),
  profitPercentage: Joi.number().required().messages({
    "any.required": "Profit percentage is required.",
    "number.base": "Profit percentage must be a number.",
  }),
  totalAmount: Joi.number().required().messages({
    "any.required": "Total amount is required.",
    "number.base": "Total amount must be a number.",
  }),
  numberOfInstallment: Joi.number().required().messages({
    "any.required": "Number of installments is required.",
    "number.base": "Number of installments must be a number.",
  }),
  installmentAmount: Joi.number().required().messages({
    "any.required": "Installment amount is required.",
    "number.base": "Installment amount must be a number.",
  }),
  openingDate: Joi.date().required().messages({
    "any.required": "Opening date is required.",
    "date.base": "Opening date must be a valid date.",
  }),
  periodOfTimeInMonths: Joi.number().required().messages({
    "any.required": "Period of time in months is required.",
    "number.base": "Period of time in months must be a number.",
  }),
  expiryDate: Joi.date().required().messages({
    "any.required": "Expiry date is required.",
    "date.base": "Expiry date must be a valid date.",
  }),
  transactions: Joi.array().items(Joi.object()).optional(),
  paid: Joi.number().optional().messages({
    "number.base": "Paid amount must be a number.",
  }),
}).messages({
  "object.unknown": "Field {{#label}} is not allowed.",
});

module.exports = loanAccountValidationSchema;
