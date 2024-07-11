import {config} from "../config.js";
import convertAnyErrorToAPIError from "../error/convertAnyErrorToAPIError.js";
import isAPIError from "../error/isAPIError.js";
import isServiceError from "../service/dataExtractors/error/isServiceError.js";

/**
 * Pipe handler determines whether the data passed in response is actually an Error and if it is, move it to errors array 
 *
 * @param {string=} respFieldName 
 * @param {string=} respErrorFieldName 
 * @returns 
 */
export const determineResError = (respFieldName, respErrorFieldName) => {
    return (req, res, next) => {
        respFieldName = respFieldName ?? config.respFieldName;
        respErrorFieldName = respErrorFieldName ?? config.respErrorFieldName;
        const respStatusFieldName = config.respStatusFieldName;

        const response = res[respFieldName];

        const error = Array.isArray(response) ? response[0] : response;

        //If error in response => move it to errors array
        if(isServiceError(error) || isAPIError(error)){
            res[respFieldName] = undefined;
            res[respErrorFieldName] = convertAnyErrorToAPIError(response);
            res[respStatusFieldName] = error['status'] ?? 500;
        }
        
        return next();
    }
}