import Joi from "joi";

/**
 *
 * @type {
 * [{ schema: SchemaMap<any, false>, location?: 'body' | 'query' | 'param' }] |
 * { schema: SchemaMap<any, false>, location?: 'body' | 'query' | 'param' }
 * }
 */
export const profileCreate = [
    {
        schema: {
            username: Joi.string().optional(),
            password: Joi.string().optional()
        }
    }
]

/**
 *
 * @type {
 * [{ schema: SchemaMap<any, false>, location?: 'body' | 'query' | 'param' }] |
 * { schema: SchemaMap<any, false>, location?: 'body' | 'query' | 'param' }
 * }
 */
export const profileSignIn = [
    {
        schema: {
            username: Joi.string().optional(),
            password: Joi.string().optional()
        }
    }
]
