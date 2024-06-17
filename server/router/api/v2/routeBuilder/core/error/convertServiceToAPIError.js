import {SERVICE_ERROR_TYPE_NAME} from "../config.js";
import {APIError} from "./APIError.js";
import {ErrorReason} from "./ErrorReason.js";
import {SEReason} from "../service/dataExtractors/error/SEReason.js";
import {ErrorName} from "./ErrorName.js";

export function convertServiceToAPIError(err) {
    if(err.type !== SERVICE_ERROR_TYPE_NAME.description)
        return new APIError({
            reason: ErrorReason.UNEXPECTED,
            additional: err
        });

    const errorName = determineName(err.reason);

    if(errorName === ErrorName.VALIDATION || errorName === ErrorName.BAD_REQUEST){
        const {reason, field, additional, message} = err;
        return new APIError({
            name: errorName,
            reason, 
            field, 
            message,
            additional,
            status: 400
        });
    } 

    if(errorName === ErrorName.UNEXPECTED){
        const {reason, field, additional, message} = err;
        return new APIError({
            name: errorName,
            reason, 
            field, 
            message,
            additional,
            status: 500
        });
    } 
}

function determineName(serviceReason) {
    const bad_req = [SEReason.NOT_UNIQUE];
    const validation = [SEReason.REQUIRED, SEReason.NOT_ALLOWED, SEReason.NOT_VALID, SEReason.NOT_STRING, SEReason.NOT_NUMBER, SEReason.NOT_BOOLEAN];

    if(validation.includes(serviceReason))
        return ErrorName.VALIDATION;

    if(bad_req.includes(serviceReason))
        return ErrorName.BAD_REQUEST;

    return ErrorName.UNEXPECTED;
}