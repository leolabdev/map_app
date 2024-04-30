import Joi from "joi";


export const profileCreate = {
    username: Joi.string().required(),
    password: Joi.string().required()
}

export const profileId = Joi.string().required();

/**
 *
 * @type {
 * { schema: SchemaMap<any, false> }
 * }
 */
export const profileSignIn = {
    username: Joi.string().required(),
    password: Joi.string().required()
}

