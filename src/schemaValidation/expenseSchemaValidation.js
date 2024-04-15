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
  date: Joi.date().required().messages({
    "any.required": "Date is required",
    "date.base": "Date must be a valid date",
  }),
  officeRent: Joi.number().required().messages({
    "any.required": "Office rent is required",
    "number.base": "Office rent must be a number",
  }),
  salary: Joi.number().required().messages({
    "any.required": "Salary is required",
    "number.base": "Salary must be a number",
  }),
  stationaryAndPrinting: Joi.number().required().messages({
    "any.required": "Stationary and printing expense is required",
    "number.base": "Stationary and printing expense must be a number",
  }),
  taDaAllowances: Joi.number().required().messages({
    "any.required": "TA/DA allowances are required",
    "number.base": "TA/DA allowances must be a number",
  }),
  anyBill: Joi.number().required().messages({
    "any.required": "Any bill expense is required",
    "number.base": "Any bill expense must be a number",
  }),
  remarks: Joi.string().allow("").messages({
    "string.base": "Remarks must be a string",
  }),
});

module.exports = expenseValidationSchema;
