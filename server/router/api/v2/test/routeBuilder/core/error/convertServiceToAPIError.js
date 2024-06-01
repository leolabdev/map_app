import {SERVICE_ERROR_TYPE_NAME} from "../config.js";
import {APIError} from "./APIError.js";
import {ErrorReason} from "./ErrorReason.js";
import {SEReason} from "../service/dataExtractors/error/SEReason.js";
import {ErrorName} from "./ErrorName.js";

export function convertServiceToAPIError(err) {
    if(err.typeSymbol !== SERVICE_ERROR_TYPE_NAME)
        return new APIError({
            reason: ErrorReason.UNEXPECTED,
            additional: err
        });

    const errorName = determineName(err.reason);

    if(errorName === ErrorName.VALIDATION){
        const {reason, field, additional} = err;
        return new APIError({
            name: errorName,
            reason, 
            field, 
            additional,
            status: 400
        });
    } 

    if(errorName === ErrorName.UNEXPECTED){
        const {reason, field, additional} = err;
        return new APIError({
            name: errorName,
            reason, 
            field, 
            additional,
            status: 500
        });
    } 
}

function determineName(serviceReason) {
    const validation = [SEReason.REQUIRED, SEReason.NOT_VALID, SEReason.NOT_STRING, SEReason.NOT_NUMBER, SEReason.NOT_BOOLEAN];

    if(validation.includes(serviceReason))
        return ErrorName.VALIDATION;

    return ErrorName.UNEXPECTED;
}