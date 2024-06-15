import Joi from "joi";

export const manufacturerCreate = {
    schema: Joi.object({
        manufacturerUsername: Joi.string().required(),
        name: Joi.string(),
        addressId: Joi.number()
    })
};

export const manufacturerUpdate = {
    schema: Joi.object({
        id: Joi.number().required(),
        manufacturerUsername: Joi.string(),
        name: Joi.string(),
        addressId: Joi.number(),
        addressIdDelete: Joi.number()
    })
};