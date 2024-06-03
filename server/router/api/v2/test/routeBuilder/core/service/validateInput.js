import {SERVICE_ERROR_TYPE_NAME} from "../config.js";
import {ServiceError} from "./dataExtractors/error/ServiceError.js";
import {SEReason} from "./dataExtractors/error/SEReason.js";
import Joi from "joi";

export function validateInput(fn, validationSchema) {
    return async function (request, options){
        if(!validationSchema)
            return fn(request);

        const {schema, field} = validationSchema;
        try {
            if(Joi.isSchema(schema)) 
                await schema.validateAsync(request, {abortEarly: false});
            else
                throw new ServiceError({
                    reason: SEReason.MISCONFIGURED
                });
            return fn(request, options);
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
        case 'any.required':
            return SEReason.REQUIRED;
        default:
            return null;
    }
}

export default function isRespServiceError(e){
    return (e && (e.type === SERVICE_ERROR_TYPE_NAME.description) ||
    (Array.isArray(e) && e[0].type === SERVICE_ERROR_TYPE_NAME.description));
}