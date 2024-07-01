import Joi from "joi";

export const addressValidate = {
    schema: Joi.object({
        street: Joi.string().required(),
        building: Joi.string(),
        city: Joi.string().required()
    })
};

export const addressReverse = {
    schema: Joi.object({
        lon: Joi.number().required(),
        lat: Joi.number().required()
    })
};

export const addressAutocomplete = {
    schema: Joi.object({
        search: Joi.string().required(),
        city: Joi.string().required()
    })
};