import Joi from "joi";

export const routingCoordinates = Joi.object({
    coordinates: Joi.array().items(
        Joi.array().items(
            Joi.number().min(0).max(180).required(),
            Joi.number().min(0).max(90).required() 
        ).length(2))
    .required(),

    startCoordinateIndex: Joi.number(),
    endCoordinateIndex: Joi.number(),
    avoidCityCenters: Joi.boolean(),
    cityCentersToAvoid: Joi.array().items(Joi.string()),
    isTrafficSituation: Joi.boolean()
});

export const routingOrders = Joi.object({
    orderIds: Joi.array().items(Joi.number()),
    startOrderId: Joi.number(),
    endOrderId: Joi.number(),
    avoidCityCenters: Joi.boolean(),
    cityCentersToAvoid: Joi.array().items(Joi.string()),
    isTrafficSituation: Joi.boolean()
});