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
            console.log(e);
            if(e.typeSymbol === SERVICE_ERROR_TYPE_NAME)
                return e;

            return new ServiceError({
                reason: SEReason.NOT_VALID,
                additional: e
            });
        }
    }
}