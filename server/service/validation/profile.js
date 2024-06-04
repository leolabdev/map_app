import Joi from "joi";

export const profileCreate = {
    schema: Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required()
    })
};

export const profileId = {
    schema: Joi.string().required(),
    field: 'id'
} 

export const profileUsername = {
    schema: Joi.string().required(),
    field: 'username'
}

export const profileSignIn = {
    schema: Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required()
    })
}

export const profileUpdate = {
    schema: Joi.object({
        id: Joi.number().required(),
        username: Joi.string(),
        password: Joi.string()
    })
};