import {SERVICE_ERROR_TYPE_NAME} from "../config.js";
import {ServiceError} from "./dataExtractors/error/ServiceError.js";
import {SEReason} from "./dataExtractors/error/SEReason.js";
import Joi from "joi";

/**
 * A higher-order function that validates the first parameter of the wrapped function
 * using the provided Joi schema.
 *
 * @param {Function} fn The function to wrap and validate.
 * @param {ServiceValidation=} validationSchema for the first function parameter
 *
 * @returns {Function} A new function that performs validation before executing the original function.
 */
export function validateInput(fn, validationSchema) {
    return async function (request, ...params){
        if(!validationSchema)
            return fn(request, ...params);

        const {schema, field} = validationSchema;
        try {
            if(!request)
                throw new ServiceError({
                    reason: SEReason.REQUIRED,
                    message: 'validateInput(): request object is not defined'
                });

            if(Joi.isSchema(schema)) 
                await schema.validateAsync(request, {abortEarly: false});
            else
                throw new ServiceError({
                    reason: SEReason.MISCONFIGURED,
                    message: 'Provided validation schema is not Joi schema'
                });
                
            return fn(request, ...params);
        } catch (e) {
            if(e.type === SERVICE_ERROR_TYPE_NAME.description)
                return e;
            //Joi error
            if(e.isJoi){
                const errors = [];
                for(let i=0, l=e.details.length; i<l; i++){
                    const reason = determineErrorReason(e.details[i]);
                    errors.push(
                        new ServiceError({
                            reason,
                            field: field ?? e.details[i]?.context?.key,
                            message: e.details[i].message
                        })
                    );
                }
                return errors;
            }

            return new ServiceError({
                reason: SEReason.UNEXPECTED,
                additional: e
            });
        }
    }
}

function determineErrorReason(joiErrorDetails) {
    switch (joiErrorDetails.type) {
        case 'string.base':
            return SEReason.NOT_STRING;
        case 'number.base':
            return SEReason.NOT_NUMBER;
        case 'boolean.base':
            return SEReason.NOT_BOOLEAN;
        case 'any.required':
            return SEReason.REQUIRED;
        case 'object.unknown':
            return SEReason.NOT_ALLOWED;
        default:
            return null;
    }
}

export default function isRespServiceError(e){
    return (e && (e.type === SERVICE_ERROR_TYPE_NAME.description) ||
    (Array.isArray(e) && e[0].type === SERVICE_ERROR_TYPE_NAME.description));
}