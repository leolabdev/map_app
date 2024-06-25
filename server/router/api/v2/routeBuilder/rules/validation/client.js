import Joi from "joi";

export const clientCreate = Joi.object({
    username: Joi.string().required(),
    name: Joi.string(),
    type: Joi.string().required(),
    city: Joi.string().required(),
    street: Joi.string().required(),
    building: Joi.string().required(),    
    flat: Joi.number()
});

export const clientSearch = Joi.object({
    search: Joi.string().required()
});

export const clientUpdate = Joi.object({
    id: Joi.number().required(),
    username: Joi.string(),
    name: Joi.string(),
    type: Joi.string(),
    city: Joi.string(),
    street: Joi.string(),
    building: Joi.string(),    
    flat: Joi.number()
});