import Joi from "joi";

export const idField = Joi.object({
    id: Joi.string().pattern(/^[0-9]+$/).required()
});