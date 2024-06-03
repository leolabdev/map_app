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

/**
 *
 * @type {
 * { schema: SchemaMap<any, false> }
 * }
 */
export const profileSignIn = {
    schema: Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required()
    })
}

