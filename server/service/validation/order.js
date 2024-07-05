import Joi from "joi";

export const orderCreate = {
    schema: Joi.object({
        senderId: Joi.number().required(),
        recipientId: Joi.number().required(),
        profileId: Joi.number().required()
    })
};

export const orderIds = {
    schema: Joi.array().required(),
    field: 'orderIds'
} 

export const orderUpdate = {
    schema: Joi.object({
        id: Joi.number().required(),
        senderId: Joi.number(),
        recipientId: Joi.number(),
        profileId: Joi.number().required()
    })
};