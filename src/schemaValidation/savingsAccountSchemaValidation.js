const Joi = require('joi');

const savingsAccountSchemaValidation = Joi.object({
    memberId: Joi.string().required().messages({
        'any.required': 'Member ID is required',
        'objectId.base': 'Member ID must be a valid String',
    }),
    branchId: Joi.string().required().messages({
        'any.required': 'Branch ID is required',
        'objectId.base': 'Branch ID must be a valid string',
    }),
    samityId: Joi.string().required().messages({
        'any.required': 'Samity ID is required',
        'objectId.base': 'Samity ID must be a valid string',
    }),
    paymentTerm: Joi.string().valid('Daily', 'Weekly', 'Fortnightly', 'Monthly', 'Quarterly', 'Half-Yearly', 'Yearly').required().messages({
        'any.required': 'Payment term is required',
        'string.base': 'Payment term must be a string',
        'any.only': 'Payment term must be one of the following: Daily, Weekly, Fortnightly, Monthly, Quarterly, Half-Yearly, Yearly',
    }),
    profitPercentage: Joi.number().required().messages({
        'any.required': 'Profit percentage is required',
        'number.base': 'Profit percentage must be a number',
    }),
    openedBy: Joi.object({
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
    openingDate: Joi.date().required().messages({
        'any.required': 'Opening date is required',
        'date.base': 'Opening date must be a valid date',
    }),
    status: Joi.string().valid('pending', 'approved', 'closed').required().messages({
        'any.required': 'Status is required',
        'string.base': 'Status must be a string',
        'any.only': 'Status must be one of the following: pending, approved, closed',
    })
});
module.exports = savingsAccountSchemaValidation