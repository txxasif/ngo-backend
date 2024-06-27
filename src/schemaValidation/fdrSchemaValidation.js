const Joi = require('joi');

const fdrAccountSchemaValidation = Joi.object({
    memberId: Joi.string().required().messages({
        'any.required': 'Member ID is required',
    }),
    branchId: Joi.string().required().messages({
        'any.required': 'Branch ID is required',
    }),
    samityId: Joi.string().required().messages({
        'any.required': 'Samity ID is required',
    }),
    type: Joi.string().valid('flat', 'percentage').required().messages({
        'any.required': 'Type is required',
        'any.only': 'Type must be either "flat" or "percentage"',
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
    paymentTerm: Joi.string().valid('At a Time', 'Monthly', 'Quarterly', 'Half-Yearly', 'Yearly').required().messages({
        'any.required': 'Payment Term is required',
        'any.only': 'Payment Term must be either "Monthly", "Quarterly", "Half-Yearly", or "Yearly"',
    }),
    periodOfTimeInMonths: Joi.number().integer().positive().required().messages({
        'any.required': 'Period of Time in Months is required',
        'number.positive': 'Period of Time in Months must be a positive number',
        'number.integer': 'Period of Time in Months must be an integer',
    }),
    profitPercentage: Joi.number().positive().required().messages({
        'any.required': 'Profit Percentage is required',
        'number.positive': 'Profit Percentage must be a positive number',
    }),
    onMatureAmount: Joi.number().required().messages({
        'any.required': 'On Mature Amount is required',
    }),
    openingDate: Joi.date().required().messages({
        'any.required': 'Opening Date is required',
    }),
    amount: Joi.number().required().messages({
        'any.required': 'Amount is required',
    }),
    totalProfit: Joi.number().required().messages({
        'any.required': 'Total Profit is required',
    }),
    totalInstallment: Joi.number().required().messages({
        'any.required': 'Total Installment is required',
    }),
    matureDate: Joi.date().required().messages({
        'any.required': 'Mature Date is required',
    }),
    profitPerInstallment: Joi.number().required().messages({
        'any.required': 'Profit Per Instalment is required',
    }),
    status: Joi.string().valid('pending', 'approved', 'closed').default('pending'),
}).messages({
    'object.base': 'Invalid request body',
});
module.exports = fdrAccountSchemaValidation;