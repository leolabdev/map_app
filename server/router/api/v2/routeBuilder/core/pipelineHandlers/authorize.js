import {APIError} from "../error/APIError.js";
import {ErrorReason} from "../error/ErrorReason.js";
import {createAsyncHandler} from "../util/createAsyncHandler.js";
import {ErrorLocation} from "../error/ErrorLocation.js";
import {Action} from "../enums/Action.js";
import {ErrorName} from "../error/ErrorName.js";

export function authorize(authFieldName, action, resource, isAllowedFn) {
    return createAsyncHandler(async (req, res, next) => {
        const user = req[authFieldName];
        if(!user)
            throw new APIError({
                reason: ErrorReason.NOT_AUTHENTICATED,
                message: 'Authentication for the endpoint is required',
                endpoint: req.baseUrl
            });

        if(!await isAllowedFn(user, action, resource))
            throw new APIError({
                reason: ErrorReason.NOT_AUTHORIZED,
                message: 'Action execution denied',
                endpoint: req.baseUrl,
                location: action === Action.CREATE || action === Action.UPDATE ? ErrorLocation.BODY : null
            });

        return next();
    });
}

