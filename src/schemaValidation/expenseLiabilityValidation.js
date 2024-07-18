const Joi = require('joi');
const expenseLiabilityJoiSchema = Joi.object({
    branchId: Joi.string()
        .hex()
        .length(24)
        .required().empty("")
        .messages({
            'any.required': 'Branch ID is required'


        }),
    samityId: Joi.string()
        .hex()
        .length(24)
        .required()
        .messages({

            'any.required': 'Samity ID is required'
        }),
    headId: Joi.string()
        .hex()
        .length(24)
        .required()
        .messages({

            'any.required': 'Head ID is required'
        }),
    by: Joi.object({
        name: Joi.string()
            .required()
            .messages({

                'any.required': 'Name is required'
            }),
        phone: Joi.string()
            .required()
            .messages({

                'any.required': 'Phone is required'
            }),
        type: Joi.string()
            .required()
            .messages({

                'any.required': 'Type is required'
            })
    }).required()
        .messages({
            'any.required': 'By object is required'
        }),
    date: Joi.date()
        .required()
        .messages({
            'date.base': 'Date should be a valid date',
            'any.required': 'Date is required'
        }),
    paidDate: Joi.date()
        .optional()
        .messages({
            'date.base': 'Paid Date should be a valid date'
        }),

    amount: Joi.number()
        .default(0)
        .required()
        .messages({
            'number.base': 'Amount should be a number',
            'any.required': 'Amount is required'
        })
});

module.exports = expenseLiabilityJoiSchema;
