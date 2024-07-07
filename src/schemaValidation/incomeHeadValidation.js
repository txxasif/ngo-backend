const Joi = require('joi');

const incomeHeadSchemaValidation = Joi.object({
    headId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
        .messages({
            'string.empty': 'Head ID is required',
            'string.pattern.base': 'Head ID must be a valid ObjectId',
            'any.required': 'Head ID is required'
        }),
    by: Joi.object({
        name: Joi.string().required()
            .messages({
                'string.empty': 'Name is required',
                'any.required': 'Name is required'
            }),
        phone: Joi.string().required()
            .messages({
                'string.empty': 'Phone number is required',
                'any.required': 'Phone number is required'
            }),
        type: Joi.string().required()
            .messages({
                'string.empty': 'Type is required',
                'any.required': 'Type is required'
            })
    }).required(),
    amount: Joi.number().required().positive()
        .messages({
            'number.base': 'Amount must be a number',
            'number.positive': 'Amount must be a positive number',
            'any.required': 'Amount is required'
        }),
    date: Joi.date().required()
        .messages({
            'date.base': 'Date must be a valid date',
            'any.required': 'Date is required'
        })
});
module.exports = incomeHeadSchemaValidation;