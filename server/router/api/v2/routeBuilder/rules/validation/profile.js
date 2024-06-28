import Joi from "joi";

export const profileCreate = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
});

export const profileUpdate = Joi.object({
    id: Joi.number().required(),
    username: Joi.string(),
    password: Joi.string()
});

export const profileSignInReq = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
});