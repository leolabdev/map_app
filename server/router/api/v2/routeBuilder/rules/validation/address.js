import Joi from "joi";

export const addressValidate = Joi.object({
    street: Joi.string().required(),
    building: Joi.string(),
    city: Joi.string().required()
});

export const addressReverse = Joi.object({
    lon: Joi.number().required(),
    lat: Joi.number().required()
})

export const addressAutocomplete = Joi.object({
    search: Joi.string().required(),
    city: Joi.string().required()
})