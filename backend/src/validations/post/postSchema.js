import Joi from 'joi';

export const postSchema = Joi.object({
    title: Joi.string().min(5).max(100).required().messages({
        'string.base': 'Title must be a string.',
        'string.min': 'Title must be at least 5 characters long.',
        'string.max': 'Title must be less than or equal to 100 characters long.',
        'any.required': 'Title is required.'
    }),

    description: Joi.string().min(15).required().messages({
        'string.base': 'Description must be a string.',
        'string.min': 'Description must be at least 15 characters long.',
        'any.required': 'Description is required.'
    }),

    price: Joi.number().min(0).max(5000).required().messages({
        'number.base': 'Price must be a number.',
        'number.min': 'Price must be at least 0.',
        'number.max': 'Price must be less than or equal to 5000.',
        'any.required': 'Price is required.'
    }),

    address: Joi.string().min(7).required().messages({
        'string.base': 'Address must be a string.',
        'string.min': 'Address must be at least 7 characters long.',
        'any.required': 'Address is required.'
    }),

    elevator: Joi.string().valid('yes', 'no').required().messages({
        'any.only': 'Elevator option must be "yes" or "no".',
        'any.required': 'Elevator option is required.'
    }),

    maximumCapacity: Joi.number().min(1).max(5).required().messages({
        'number.base': 'Maximum capacity must be a number.',
        'number.min': 'Maximum capacity must be at least 1.',
        'number.max': 'Maximum capacity must be less than or equal to 5.',
        'any.required': 'Maximum capacity is required.'
    })
});
