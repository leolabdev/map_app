import Joi from "joi";

export const clientCreate = Joi.object({
    username: Joi.string().required(),
    name: Joi.string().optional(),
    addressId: Joi.number().integer().optional()
});

export const clientSearch = Joi.object({
    search: Joi.string().required()
});