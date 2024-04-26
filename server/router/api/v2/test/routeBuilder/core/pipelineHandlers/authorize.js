import {APIError} from "../../error/APIError.js";
import {ErrorReason} from "../../error/ErrorReason.js";
import {createAsyncHandler} from "../util/createAsyncHandler.js";

export function authorize(action, resource, isAllowedFn) {
    return createAsyncHandler(async (req, res, next) => {
        const {authFieldName} = req;
        const user = req[authFieldName];
        if(!user)
            throw new APIError(ErrorReason.NOT_AUTHENTICATED, 'Authentication for the endpoint is required', req.baseUrl);

        if(!await isAllowedFn(user, action, resource))
            throw new APIError(ErrorReason.NOT_AUTHORIZED, 'Action execution denied', req.baseUrl);

        return next();
    });
}

