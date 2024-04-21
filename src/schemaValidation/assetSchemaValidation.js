const Joi = require("joi");

const assetValidationSchema = Joi.object({
  branchId: Joi.string().required().messages({
    "any.required": "Branch ID is required.",
    "string.empty": "Branch ID cannot be empty.",
  }),
  samityId: Joi.string().required().messages({
    "any.required": "Samity ID is required.",
    "string.empty": "Samity ID cannot be empty.",
  }),

  type: Joi.string().valid("fixed", "temporary").messages({
    "any.only": 'Type must be either "fixed" or "temporary".',
  }),
  productName: Joi.string().required().messages({
    "any.required": "Product name is required.",
    "string.empty": "Product name cannot be empty.",
  }),
  quantity: Joi.number().required().messages({
    "any.required": "Quantity is required.",
    "number.base": "Quantity must be a number.",
  }),
  amount: Joi.number().required().messages({
    "any.required": "Amount is required.",
    "number.base": "Amount must be a number.",
  }),
  description: Joi.string().required().messages({
    "any.required": "Description is required.",
    "string.empty": "Description cannot be empty.",
  }),
  remarks: Joi.string().required().messages({
    "any.required": "Remarks is required.",
    "string.empty": "Remarks cannot be empty.",
  }),
  date: Joi.date().required().messages({
    "any.required": "Date is required.",
    "date.base": "Date must be a valid date.",
  }),
});

module.exports = assetValidationSchema;
