import profileValidationSchema from './profileSchema.js';

const validateProfileUpdate = async (req, res, next) => {
    try {
        await profileValidationSchema.validateAsync(req.body, { abortEarly: false });

        // If there are files, validate them
        if (req.files && req.files.profilePhoto) {
            const file = req.files.profilePhoto;
            await profileValidationSchema.validateAsync({
                profilePhoto: {
                    mimetype: file.mimetype,
                    size: file.size,
                },
            }, { abortEarly: false });
        }

        // If validation passes, proceed to the next middleware
        next();
    } catch (error) {
        // If validation fails, send an error response
        const errorMessages = error.details.map(detail => detail.message);
        errorMessages.forEach(msg => toast.error(msg));

        return res.status(400).json({
            message: 'Validation failed',
            errors: errorMessages,
        });
    }
};

export default validateProfileUpdate;
