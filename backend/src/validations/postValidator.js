import postCreationSchema from './schemas/postCreationSchema.js';

export const validatePostCreation = (req, res, next) => {
    const { error } = postCreationSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const errorDetails = error.details.map((detail) => detail.message);
        return res.status(400).json({ message: 'Validation Error', errors: errorDetails });
    }

    next();
};

export const validatePostUpdate = (req, res, next) => {
    const { error } = postCreationSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const errorDetails = error.details.map((detail) => detail.message);
        return res.status(400).json({ message: 'Validation Error', errors: errorDetails });
    }

    next();
};


