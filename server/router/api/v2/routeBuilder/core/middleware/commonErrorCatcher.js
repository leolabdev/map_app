import {API_ERROR_TYPE_NAME, config} from "../config.js";
import {APIError} from "../error/APIError.js";

export const commonErrorCatcher = (err, req, res, next) => {
    const {respErrorFieldName} = config;

    const error = err.typeSymbol === API_ERROR_TYPE_NAME ?
        err :
        new APIError({additional: err});

    res.statusCode = error.status;
    return res.json({
        [respErrorFieldName]: [error]
    });
}