import { API_ERROR_TYPE_NAME } from "../config.js";
import { APIError } from "../error/APIError.js";
import { ErrorReason } from "../error/ErrorReason.js";
import MultipleError from "../error/MultipleError.js";
import {createAsyncHandler} from "../util/createAsyncHandler.js";
import Joi from "joi";

/**
 * 
 * @param {SchemaMap<any, false>} schema 
 * @param {'body' | 'query' | 'params'=} location 
 * @param {string=} field 
 * @returns 
 */
const validate = (schema, location='body', field=null) => {
    return createAsyncHandler(async function (req, res, next) {
        try {
            if(Joi.isSchema(schema)) 
               await schema.validateAsync(req[location], {abortEarly: false});
            else
                throw new APIError({
                    message: 'validate(): Error on validation. Provided param is not a schema',
                    reason: ErrorReason.SERVER_MISCONFIGURED
                })

            return next();
        } catch (e) {
            if(e.type === API_ERROR_TYPE_NAME.description)
                throw e;
            //Joi error
            if(e.isJoi){
                const errors = [];
                for(let i=0, l=e.details.length; i<l; i++){
                    const reason = determineErrorReason(e.details[i]);
                    errors.push(
                        new APIError({
                            reason,
                            location,
                            field: field ?? e.details[i]?.context?.key,
                            message: e.details[i].message
                        })
                    );
                }
                throw new MultipleError(errors);
            }

            throw new APIError({
                reason: ErrorReason.UNEXPECTED,
                message: 'Unexpected error happened on validation',
                additional: e
            });
        }
    })
}

function determineErrorReason(joiErrorDetails) {
    switch (joiErrorDetails.type) {
        case 'string.base':
            return ErrorReason.NOT_STRING;
        case 'number.base':
            return ErrorReason.NOT_NUMBER;
        case 'boolean.base':
            return ErrorReason.NOT_BOOLEAN;
        case 'array.base':
            return ErrorReason.NOT_ARRAY;
        case 'any.required':
            return ErrorReason.REQUIRED;
        default:
            return null;
    }
}

export default validate;

/*
const validate = (validation) => {
    return createAsyncHandler(async function (req, res, next) {
        try {
            if(Array.isArray(validation)) {
                for(let i = 0, len=validation.length; i < len; i++)
                    await validateData(req, validation[i]);

                return next();
            }

            await validateData(req, validation);
            return next();
        } catch (error) {
            error.status = 400;
            throw error;
        }
    })
}
*/