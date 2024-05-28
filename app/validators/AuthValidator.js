"use strict";
const Joi = require("joi");
const { validate } = require("../utils/helpers")


const emailSchema = Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'io', 'org', 'ng', 'edu'] } })
    .required()
    .messages({
        'string.email': 'Username must be a valid email address.',
        'string.empty': 'Username cannot be empty.',
        'any.required': 'Username is required.'
    });



const passwordSchema = Joi.string()
    .min(8)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$'))
    .required()
    .messages({
        'string.min': 'Password must be at least 8 characters long.',
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
        'string.empty': 'Password cannot be empty.',
        'any.required': 'Password is required.'
    });

exports.createUser = async (body) => {
    let schema = {
        email: emailSchema,
        password:passwordSchema
    }
    return validate(schema, body)
};

exports.login = async (body) => {
    let schema = {
        email: emailSchema,
        password: passwordSchema

    }
    return validate(schema, body)
}