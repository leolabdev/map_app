import jwt from "jsonwebtoken";
import {User} from "../authentication/User.js";
import {APIError} from "../error/APIError.js";
import {ErrorReason} from "../error/ErrorReason.js";
import {ErrorLocation} from "../error/ErrorLocation.js";

const secret = 'your_secret_key';

export const authenticate = (authFieldName) => {
    return function(req, res, next){
        const authHeader = req.headers.authorization;
        const authError = new APIError({
            endpoint: req.baseUrl,
            location: ErrorLocation.HEADER,
            field: 'Authorization'
        });

        if(!authHeader)
            throw {...authError,
                message: 'Authorization Bearer header is required',
                reason: ErrorReason.AUTH_TOKEN_NOT_PROVIDED,
            };

        const [authType, token] = authHeader.split(' ');

        if(!authType || authType !== 'Bearer' || !token)
            throw {...authError,
                message: 'Could not authenticate with provided token. Token is in invalid form. It must be in Bearer form',
                reason: ErrorReason.INVALID_AUTH_TOKEN_FORMAT,
            };

        try {
            const decoded = jwt.verify(token, secret);
            req[authFieldName] = new User(decoded.id);
            return next();
        } catch (error) {
            throw {...authError,
                message: 'Could not authenticate with provided token. Token is invalid or expired',
                reason: ErrorReason.AUTHENTICATION_FAILED,
            };
        }
    }
}