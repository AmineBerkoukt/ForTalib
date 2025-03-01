import Joi from "joi";

export const signupSchema = Joi.object({
    firstName: Joi.string().trim().min(2).max(50).required().messages({
        "string.empty": "First name is required.",
        "string.min": "First name must be at least 2 characters.",
        "string.max": "First name must be less than 50 characters."
    }),
    lastName: Joi.string().trim().min(2).max(50).required().messages({
        "string.empty": "Last name is required.",
        "string.min": "Last name must be at least 2 characters.",
        "string.max": "Last name must be less than 50 characters."
    }),
    email: Joi.string().email().required().messages({
        "string.email": "Invalid email format.",
        "string.empty": "Email is required."
    }),
    password: Joi.string().min(8).required().messages({
        "string.min": "Password must be at least 8 characters.",
        "string.empty": "Password is required."
    }),
    phoneNumber: Joi.string()
        .pattern(/^\d{10}$/)
        .required()
        .messages({
            "string.pattern.base": "Phone number must be exactly 10 digits.",
            "string.empty": "Phone number is required."
        }),
    hasAcceptedTermsAndConditions: Joi.boolean().valid(true).required().messages({
        "any.only": "You must accept the Terms and Conditions."
    })
});
