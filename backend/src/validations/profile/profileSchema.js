import Joi from 'joi';

// Define the schema for the profile update validation
const profileSchema = Joi.object({
    phoneNumber: Joi.string()
        .pattern(/^\d{10}$/)
        .message('Invalid phone number')
        .optional(),

    cin: Joi.string()
        .pattern(/^[A-Za-z]{1,2}\d{1,7}$/)
        .message('Invalid CIN')
        .optional(),

    firstName: Joi.string()
        .min(1)
        .max(50)
        .optional(),

    lastName: Joi.string()
        .min(1)
        .max(50)
        .optional(),

    profilePhoto: Joi.object({
        mimetype: Joi.string().valid('image/jpeg', 'image/png', 'image/gif').required(),
        size: Joi.number().max(5 * 1024 * 1024).required(),  // 5MB max file size
    }).optional().messages({
        'object.base': 'Invalid file type or size. Please upload a valid image.',
        'object.mimetype': 'Only JPEG, PNG, and GIF images are allowed.',
        'object.size': 'Image size must be less than 5MB.',
    }),
});

export default profileSchema;