import Joi from "joi";

export const manufacturerCreate = {
    schema: Joi.object({
        manufacturerUsername: Joi.string().required(),
        name: Joi.string(),
        addressId: Joi.number()
    })
};

export const manufacturerName = {
    schema: Joi.string().required(),
    field: 'manufacturerUsername'
} 

export const manufacturerUpdate = {
    schema: Joi.object({
        manufacturerUsername: Joi.string().required(),
        name: Joi.string(),
        addressId: Joi.number(),
        addressIdDelete: Joi.number()
    })
};