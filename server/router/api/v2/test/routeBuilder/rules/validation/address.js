import Joi from "joi";

export const addressReverse = Joi.object({
    lat: Joi.number().required(),
    lon: Joi.number().required()
});