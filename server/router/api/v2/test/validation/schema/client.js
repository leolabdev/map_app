import Joi from "joi";
/**
 *
 * @type {ObjectSchema<any>}
 */
export const client = Joi.object({
    clientUsername: Joi.string().required(),
    name: Joi.string().optional(),
    addressId: Joi.number().integer().optional()
});