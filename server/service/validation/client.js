import Joi from "joi";

export const clientCreate = {
    schema: Joi.object({
        clientUsername: Joi.string().required(),
        name: Joi.string(),
        addressId: Joi.number()
    })
};

export const clientName = {
    schema: Joi.string().required(),
    field: 'clientUsername'
} 

export const clientUpdate = {
    schema: Joi.object({
        clientUsername: Joi.string().required(),
        name: Joi.string(),
        addressId: Joi.number(),
        addressIdDelete: Joi.number()
    })
};