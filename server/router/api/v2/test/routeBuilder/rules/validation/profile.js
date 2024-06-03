import Joi from "joi";


export const profileCreate = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
})


export const profileSignIn = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
})
