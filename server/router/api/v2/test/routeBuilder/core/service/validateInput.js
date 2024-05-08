import {SERVICE_ERROR_TYPE_NAME} from "../config.js";
import {ServiceError} from "./dataExtractors/error/ServiceError.js";
import {SEReason} from "./dataExtractors/error/SEReason.js";
import Joi from "joi";

export function validateInput(fn, validationSchema) {
    return async function (request, options){
        if(!validationSchema)
            return fn(request);

        try {
            if(Joi.isSchema(validationSchema))
                await validationSchema.validateAsync(request);
            else
                throw new ServiceError({
                    reason: SEReason.MISCONFIGURED
                });

            return fn(request, options);
        } catch (e) {
            //console.log(e);
            //console.log(e.details[0].context);
            if(e.typeSymbol === SERVICE_ERROR_TYPE_NAME)
                return e;

            //Joi error
            if(e.details && e.details[0]){
                const reason = determineErrorReason(e.details[0]);
                return new ServiceError({
                    reason,
                    field: e.details[0].label
                });
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
        default:
            return null;
    }
}