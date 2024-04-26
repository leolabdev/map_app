import Joi from "joi";


export const profileCreate = {
    schema: {
        username: Joi.string().required(),
        password: Joi.string().required()
    }
}


/**
 *
 * @type {
 * [{ schema: SchemaMap<any, false>, location?: 'body' | 'query' | 'param' }] |
 * { schema: SchemaMap<any, false>, location?: 'body' | 'query' | 'param' }
 * }
 */
export const profileSignIn = {
    schema: {
        username: Joi.string().required(),
        password: Joi.string().required()
    }
}

