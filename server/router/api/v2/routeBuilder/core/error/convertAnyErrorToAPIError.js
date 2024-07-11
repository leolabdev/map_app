import { API_MULTIPLE_ERROR } from "../config.js";
import isServiceError from "../service/dataExtractors/error/isServiceError.js";
import { APIError } from "./APIError.js";
import { convertServiceToAPIError } from "./convertServiceToAPIError.js";
import { ErrorReason } from "./ErrorReason.js";
import isAPIError from "./isAPIError.js";

export default function convertAnyErrorToAPIError(e) {
    if(!e || (Array.isArray(e) && e.length === 0))
        return null;

    if(e['type'] === API_MULTIPLE_ERROR)
        return e.errors;

    if(Array.isArray(e) && isAPIError(e[0]))
        return e;

    if(Array.isArray(e) && isServiceError(e[0])){
        const errors = [];
        for(let i=0, l=e.length; i<l; i++)
            errors.push(convertServiceToAPIError(e[i]));
        
        return errors;
    }

    if(isServiceError(e))
        return convertServiceToAPIError(e);   

    if(isAPIError(e))
        return e;

    return new APIError({reason: ErrorReason.UNEXPECTED, additional: e});
}