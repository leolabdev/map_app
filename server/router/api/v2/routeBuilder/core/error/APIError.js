import {ErrorReason} from "./ErrorReason.js";
import {ErrorStatus} from "./ErrorStatus.js";
import {API_ERROR_TYPE_NAME} from "../config.js";
import {ErrorName} from "./ErrorName.js";

export class APIError{
    /**
     *
     * @param {ErrorName} name
     * @param {ErrorReason} reason
     * @param {ErrorStatus} status
     * @param {ErrorLocation | null} location
     * @param {string} message
     * @param {string | null} endpoint
     * @param {string | null} field
     * @param {{} | null} additional
     */
    constructor(
        {
            name,
            reason = ErrorReason.UNEXPECTED,
            status,
            location = null,
            message = 'Unexpected server error occurred',
            endpoint = null,
            field = null,
            additional = null
        }
    ){
        this.reason = reason;
        this.location = location;
        this.message = message;
        this.endpoint = endpoint;
        this.field = field;
        this.additional = additional;

        this.name = name ?? determineName(reason);
        this.status = status ?? determineStatus(this.name);
        this.typeSymbol = API_ERROR_TYPE_NAME;
        this.type = API_ERROR_TYPE_NAME.description;
    }
    reason;
    status;
    location;
    message;
    endpoint;
    field;
    additional;
}

/**
 *
 * @param {ErrorName} name
 * @returns {ErrorStatus}
 */
function determineStatus(name){
    switch(name){
        case ErrorName.NOT_FOUND:
            return ErrorStatus['404'];
        case ErrorName.BAD_REQUEST:
            return ErrorStatus['400'];
        case ErrorName.VALIDATION:
            return ErrorStatus['400'];
        case ErrorName.NOT_AUTHENTICATED:
            return ErrorStatus['401'];
        case ErrorName.NOT_AUTHORIZED:
            return ErrorStatus['403'];
        case ErrorName.TOO_MANY_REQUESTS:
            return ErrorStatus['429'];
        default:
            return ErrorStatus['500'];
    }
}


/**
 *
 * @param {ErrorReason} reason
 * @returns {ErrorName}
 */
function determineName(reason){
    const notFound = [ErrorReason.NOT_FOUND];
    const badRequest = [ErrorReason.BAD_REQUEST];
    const validation = [
        ErrorReason.REQUIRED, ErrorReason.VALIDATION, 
        ErrorReason.NOT_STRING, ErrorReason.NOT_NUMBER, 
        ErrorReason.NOT_BOOLEAN, ErrorReason.NOT_ARRAY
    ];
    const notAuthenticated = [
        ErrorReason.NOT_AUTHENTICATED, ErrorReason.AUTH_TOKEN_NOT_PROVIDED,
        ErrorReason.INVALID_AUTH_TOKEN_FORMAT, ErrorReason.INVALID_AUTH_TOKEN,
        ErrorReason.AUTHENTICATION_FAILED, ErrorReason.WRONG_CREDENTIALS
    ];
    const notAuthorized = [ErrorReason.NOT_AUTHORIZED];
    const tooManyRequests = [ErrorReason.TOO_MANY_REQUESTS];
    const server = [ErrorReason.SERVER_MISCONFIGURED, ErrorReason.SERVER_ERROR];

    if(notFound.includes(reason))
        return ErrorName.NOT_FOUND;

    if(badRequest.includes(reason))
        return ErrorName.BAD_REQUEST;

    if(validation.includes(reason))
        return ErrorName.VALIDATION;

    if(notAuthenticated.includes(reason))
        return ErrorName.NOT_AUTHENTICATED;

    if(notAuthorized.includes(reason))
        return ErrorName.NOT_AUTHENTICATED;

    if(tooManyRequests.includes(reason))
        return ErrorName.TOO_MANY_REQUESTS;

    if(server.includes(reason))
        return ErrorName.SERVER_ERROR;

    return ErrorName.UNEXPECTED;
}