import Joi from "joi";


const schema = Joi.object().pattern(
    Joi.string(), // Key pattern (optional if keys are unknown)
    Joi.number().integer().required() // Value pattern: all values must be integers
  );
// export const profileCreate = {
//     schema: schema
// };

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

