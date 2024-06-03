import {API_ERROR_TYPE_NAME, API_MULTIPLE_ERROR, config} from "../config.js";
import {APIError} from "../error/APIError.js";

export const catchErrors = (respErrorFieldName) => {
    return (err, req, res, next) => {
        let previousErrors = [];
        if(Array.isArray(res[respErrorFieldName]))
            previousErrors = res[respErrorFieldName];

        const {respStatusFieldName} = config;

        if(err.type === API_MULTIPLE_ERROR){
            const errors = err.errors;

            for(let i=0, l=errors.length; i<l; i++)
                errors[i].endpoint = req.originalUrl;
            
            res[respErrorFieldName] = [...previousErrors, ...errors];
            res[respStatusFieldName] = err.status ?? errors[0].status;
        }else {
            const error = err.type === API_ERROR_TYPE_NAME.description ?
            err :
            new APIError({additional: err});

            error.endpoint = req.originalUrl;

            res[respErrorFieldName] = [...previousErrors, error];
            res[respStatusFieldName] = error.status;
        }

        return next();
    }
}