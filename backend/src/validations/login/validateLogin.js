import { loginSchema } from "./loginSchema.js";

export const validateLogin = (req, res, next) => {
    const { error } = loginSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const errorMessages = error.details.map(detail => detail.message);
        return res.status(400).json({
            message: "Validation errors",
            errors: errorMessages
        });
    }

    next();
};
