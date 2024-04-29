import {API_ERROR_TYPE_NAME, config} from "../config.js";
import {APIError} from "../error/APIError.js";

export const catchErrors = (respErrorFieldName) => {
    return (err, req, res, next) => {
        let previousErrors = [];
        if(Array.isArray(res[respErrorFieldName]))
            previousErrors = res[respErrorFieldName];

        const error = err.typeSymbol === API_ERROR_TYPE_NAME ?
            err :
            new APIError({additional: err});

        res[respErrorFieldName] = [...previousErrors, error];
        const {respStatusFieldName} = config;
        res[respStatusFieldName] = error.status;

        return next();
    }
}