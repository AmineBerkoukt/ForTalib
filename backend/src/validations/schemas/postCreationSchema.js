import Joi from 'joi';

const postCreationSchema = Joi.object({
    title: Joi.string().min(8).required(),
    description: Joi.string().min(10).required(),
    images: Joi.array().items(Joi.string()).max(6).optional(),
    price: Joi.number().min(0).required(),
    address: Joi.string().min(5).max(255).required(),
    elevator: Joi.boolean().required(),
    maximumCapacity: Joi.number().min(1).max(5).required(),
});

export default postCreationSchema;
