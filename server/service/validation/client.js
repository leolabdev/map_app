import Joi from "joi";

export const clientCreate = {
    schema: Joi.object({
        username: Joi.string().required(),
        name: Joi.string(),
        type: Joi.string().required(),
        city: Joi.string().required(),
        street: Joi.string().required(),
        building: Joi.string().required(),    
        flat: Joi.number(),
        profileId: Joi.number().required(),
        lon: Joi.number().required(),
        lat: Joi.number().required()
    })
};

export const clientUpdate = {
    schema: Joi.object({
        id: Joi.number().required(),
        username: Joi.string(),
        name: Joi.string(),
        type: Joi.string(),
        city: Joi.string(),
        street: Joi.string(),
        building: Joi.string(),    
        flat: Joi.number(),
        lon: Joi.number(),
        lat: Joi.number()
    })
};