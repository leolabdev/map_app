import Joi from "joi";

export const orderCreate = Joi.object({
    senderId: Joi.number().required(),
    recipientId: Joi.number().required(),
});

export const orderUpdate = Joi.object({
    id: Joi.number().required(),
    senderId: Joi.number(),
    recipientId: Joi.number(),
});

export const orderDone = Joi.object({
    orderIds: Joi.array().items(Joi.number()).required()
});