import Joi from 'joi';

const postCreationSchema = Joi.object({
    title: Joi.string().min(8).optional(),
    description: Joi.string().min(10).optional(),
    images: Joi.array().items(Joi.string()).max(6).optional(),
    price: Joi.number().min(0).optional(),
    address: Joi.string().min(5).max(255).optional(),
    elevator: Joi.boolean().optional(),
    maximumCapacity: Joi.number().min(1).max(5).optional(),
    avgRate: Joi.number().min(0).max(5).optional(), // Optional field
});

export default postCreationSchema;
