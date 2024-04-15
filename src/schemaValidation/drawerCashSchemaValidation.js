const Joi = require("joi");

const drawerCashValidationSchema = Joi.object({
  amount: Joi.number().required().messages({
    "any.required": "Amount is required",
    "number.base": "Amount must be a number",
  }),
  branchId: Joi.string().required().messages({
    "any.required": "Branch ID is required",
    "string.base": "Branch ID must be a string",
  }),
  samityId: Joi.string().required().messages({
    "any.required": "Samity ID is required",
    "string.base": "Samity ID must be a string",
  }),
  date: Joi.date().required().messages({
    "any.required": "Date is required",
    "date.base": "Date must be a valid date",
  }),
  sourceDetails: Joi.string().required().messages({
    "any.required": "Source details are required",
    "string.base": "Source details must be a string",
  }),
  remarks: Joi.string().required().messages({
    "any.required": "Remarks are required",
    "string.base": "Remarks must be a string",
  }),
  type: Joi.string().valid("cashIn", "cashOut").default("cashIn").messages({
    "any.only": 'Type must be either "cashIn" or "cashOut"',
    "string.base": "Type must be a string",
  }),
});

module.exports = drawerCashValidationSchema;
