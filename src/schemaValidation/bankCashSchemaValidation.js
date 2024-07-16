const Joi = require("joi");

const bankCashValidationSchema = Joi.object({
  amount: Joi.number().required().messages({
    "any.required": "Amount is required",
    "number.base": "Amount must be a number",
  }),
  bankId: Joi.string().required().messages({
    "any.required": "Bank ID is required",
    "string.base": "Bank ID must be a string",
  }),
  isCapital: Joi.boolean().required().messages({
    'any.required': 'isCapital is required',
    'boolean.base': 'isCapital must be a boolean',
  }),
  transactionDetails: Joi.object({
    date: Joi.date().required().messages({
      "any.required": "Date is required",
      "date.base": "Date must be a valid date",
    }),
    sourceDetails: Joi.string().required().messages({
      "any.required": "Source details are required",
      "string.base": "Source details must be a string",
    }),
    by: Joi.object({
      name: Joi.string().required().messages({
        "any.required": "Name is required",
        "string.base": "Name must be a string",
      }),
      phone: Joi.string().required().messages({
        "any.required": "Phone is required",
        "string.base": "Phone must be a string",
      }),
      type: Joi.string().required().messages({
        "any.required": "Type is required",
        "string.base": "Type must be a string",
      }),
    }).required(),
  }).required(),
  type: Joi.string().valid("cashIn", "cashOut").default("cashIn").messages({
    "any.only": 'Type must be either "cashIn" or "cashOut"',
    "string.base": "Type must be a string",
  }),
});

module.exports = bankCashValidationSchema;
