import Joi from "joi";

export const dataCreate = {
    schema: Joi.object({
        name: Joi.string().required(),
        value: Joi.string(),
        lastUpdated: Joi.date()
    })
};

export const dataName = {
    schema: Joi.string().required(),
    field: 'name'
} 

export const dataUpdate = {
    schema: Joi.object({
        name: Joi.string().required(),
        value: Joi.object().required(),
        lastUpdated: Joi.date()
    })
};