import Joi from "joi";

export const areaCreate = {
    schema: Joi.object({
        areaName: Joi.string().required(),
        polygon: Joi.alternatives().try(Joi.string(), Joi.object()).required()
    })
};

export const areaName = {
    schema: Joi.string().required(),
    field: 'areaName'
} 

export const areaUpdate = {
    schema: Joi.object({
        areaName: Joi.string().required(),
        polygon: Joi.object().required()
    })
};