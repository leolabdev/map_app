import Joi from "joi";

export const orderCreate = {
    schema: Joi.object({
        manufacturerUsername: Joi.string().required(),
        clientUsername: Joi.string().required(),
        shipmentAddressId: Joi.number().required(),
        deliveryAddressId: Joi.number().required(),
    })
};

export const orderIds = {
    schema: Joi.array().required(),
    field: 'orderIds'
} 

export const orderUpdate = {
    schema: Joi.object({
        orderId: Joi.number().required(),
        manufacturerUsername: Joi.string(),
        clientUsername: Joi.string(),
        shipmentAddressId: Joi.number(),
        deliveryAddressId: Joi.number(),
    })
};