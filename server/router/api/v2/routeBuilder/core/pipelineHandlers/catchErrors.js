import {config} from "../config.js";
import convertAnyErrorToAPIError from "../error/convertAnyErrorToAPIError.js";

export const catchErrors = (respErrorFieldName) => {
    return (err, req, res, next) => {
        respErrorFieldName = respErrorFieldName ?? config.respErrorFieldName;
        const oldErrors = res[respErrorFieldName];
        let previousErrors = [];
        if(oldErrors)
            previousErrors = Array.isArray(oldErrors) ? oldErrors : [oldErrors];

        const {respStatusFieldName} = config;
        const apiError = convertAnyErrorToAPIError(err);

        if(Array.isArray(apiError)){
            for(let i=0, l=apiError.length; i<l; i++)
                apiError[i].endpoint = req.originalUrl;
            
            res[respErrorFieldName] = [...previousErrors, ...apiError];
            res[respStatusFieldName] = apiError[0].status ?? 500;
        } else {
            apiError.endpoint = req.originalUrl;

            res[respErrorFieldName] = [...previousErrors, apiError];
            res[respStatusFieldName] = apiError.status ?? 500;
        }

        return next();
    }
}