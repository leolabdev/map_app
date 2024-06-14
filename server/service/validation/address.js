import Joi from "joi";

export const addressCreate = {
    schema: Joi.object({
        city: Joi.string().required(),
        street: Joi.string().required(),
        building: Joi.string().required(),    
        flat: Joi.number(),
        lon: Joi.number().required(),
        lat: Joi.number().required()
    })
};

export const addressUpdate = {
    schema: Joi.object({
        id: Joi.number().required(),
        city: Joi.string(),
        street: Joi.string(),
        building: Joi.string(),    
        flat: Joi.number(),
        lon: Joi.number(),
        lat: Joi.number()
    })
};

export const addressSearch = {
    schema: Joi.object({
        where: Joi.object({
            city: Joi.string(),
            street: Joi.string(),
            building: Joi.string(),    
            flat: Joi.number(),
            lon: Joi.number(),
            lat: Joi.number()
        })       
    })
};