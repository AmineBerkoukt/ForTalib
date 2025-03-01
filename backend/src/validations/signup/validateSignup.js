import { signupSchema } from "./signupSchema.js";

export const validateSignup = (req, res, next) => {
    const { error } = signupSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const errorMessages = error.details.map(detail => detail.message);
        return res.status(400).json({
            message: "Validation errors",
            errors: errorMessages
        });
    }

    next();
};
