import { registrationSchema, loginSchema, updateProfileSchema } from './schemas/userSchema.js';

export const validateRegistration = (req, res, next) => {
    const { error } = registrationSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errorMessages = error.details.map(detail => detail.message);
        return res.status(400).json({
            message: 'Validation errors',
            errors: errorMessages
        });
    }
    next();
};

export const validateLogin = (req, res, next) => {
    const { error } = loginSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errorMessages = error.details.map(detail => detail.message);
        return res.status(400).json({
            message: 'Validation errors',
            errors: errorMessages
        });
    }
    next();
};

export const validateUpdatingProfile = (req, res, next) => {
    const bodyToValidate = { ...req.body };
    Object.keys(bodyToValidate).forEach(key => bodyToValidate[key] === undefined && delete bodyToValidate[key]);

    const { error } = updateProfileSchema.validate(bodyToValidate, {
        abortEarly: false,
        allowUnknown: false
    });

    if (error) {
        const errorMessages = error.details.map(detail => detail.message);
        return res.status(400).json({
            message: 'Validation errors',
            errors: errorMessages
        });
    }

    req.body = bodyToValidate;
    next();
};