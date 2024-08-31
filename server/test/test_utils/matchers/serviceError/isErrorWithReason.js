import { SERVICE_ERROR_TYPE_NAME } from "../../../../router/api/v2/routeBuilder/core/config";
import { ServiceError } from "../../../../router/api/v2/routeBuilder/core/service/dataExtractors/error/ServiceError";

/**
 * Checks whenever the error is ServiceError and has the specified reason field
 * @param {*} error error to check
 * @param {*} reason reason the error should have
 * @returns {boolean} _true_ if it is ServiceError with provided reason and _false_ if not
 */
export function isErrorWithReason(error, reason) {
    if(!(error instanceof ServiceError))
        return false;

    return error.type === SERVICE_ERROR_TYPE_NAME.description && error.reason === reason;
}