import Joi from "joi";

export const orderCreate = {
    schema: Joi.object({
        manufacturerId: Joi.number().required(),
        clientId: Joi.number().required(),
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
        id: Joi.number().required(),
        manufacturerId: Joi.number(),
        clientId: Joi.number(),
        shipmentAddressId: Joi.number(),
        deliveryAddressId: Joi.number(),
    })
};