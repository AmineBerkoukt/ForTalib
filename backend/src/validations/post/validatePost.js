import { postSchema } from './postSchema.js';

export const validatePost = (req, res, next) => {
    const { error } = postSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const errorMessages = error.details.map((err) => err.message);
        return res.status(400).json({
            message: 'Validation error',
            errors: errorMessages,
        });
    }

    next();
};
