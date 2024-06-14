import Joi from "joi";

export const idField = {
    schema: Joi.number().required(),
    field: 'id'
} 