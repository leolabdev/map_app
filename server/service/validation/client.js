import Joi from "joi";

export const clientCreate = {
    schema: Joi.object({
        clientUsername: Joi.string().required(),
        name: Joi.string(),
        addressId: Joi.number()
    })
};

export const clientUpdate = {
    schema: Joi.object({
        id: Joi.number().required(),
        clientUsername: Joi.string(),
        name: Joi.string(),
        addressId: Joi.number(),
        addressIdDelete: Joi.number()
    })
};