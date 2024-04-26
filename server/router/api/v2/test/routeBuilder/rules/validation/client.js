import Joi from "joi";

/**
 *
 * @type {
 * [{ schema: SchemaMap<any, false>, location?: 'body' | 'query' | 'param' }] |
 * { schema: SchemaMap<any, false>, location?: 'body' | 'query' | 'param' }
 * }
 */
export const clientCreate = [
    {
        schema: {
            clientUsername: Joi.string().required(),
            name: Joi.string().optional(),
            addressId: Joi.number().integer().optional()
        }
    },
    {
        schema: {
            search: Joi.string().required()
        },
        location: 'query'
    }
]
