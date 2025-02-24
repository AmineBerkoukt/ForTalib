import Joi from 'joi';

export const registrationSchema = Joi.object({
    firstName: Joi.string().trim().required(),
    lastName: Joi.string().trim().required(),
    email: Joi.string().trim().email().lowercase().required(),
    password: Joi.string().required(),
    cin: Joi.string().trim().optional(),
    phoneNumber: Joi.string().length(10).required(),
    address: Joi.string().trim().required(),
    profilePhoto: Joi.string().trim(),
    studies: Joi.object({
        level: Joi.string().trim(),
        school: Joi.string().trim(),
    })
});

export const loginSchema = Joi.object({
    email: Joi.string().trim().email().lowercase().required(),
    password: Joi.string().required()
});


export const updateProfileSchema = Joi.object({
    firstName: Joi.string().trim(),
    lastName: Joi.string().trim(),
    phoneNumber: Joi.string().length(10),
    address: Joi.string().trim(),
    studies: Joi.object({
            level: Joi.string().trim(),
            school: Joi.string().trim(),
    }),
});
