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

    if(err.reason === SEReason.NOT_STRING)
    return new APIError({
        reason: ErrorReason.VALIDATION,

    });
}

function determineReason(serviceReason) {
    const service = [SEReason.UNEXPECTED];
    const validation = [SEReason.NOT_VALID, SEReason.NOT_STRING, SEReason.NOT_NUMBER, SEReason.NOT_BOOLEAN];

    if(service.includes(serviceReason))
        return ErrorName.NOT_FOUND;
}