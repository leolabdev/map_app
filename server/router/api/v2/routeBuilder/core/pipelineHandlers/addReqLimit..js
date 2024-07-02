import rateLimit from "express-rate-limit";
import { config } from "../config.js";
import { APIError } from "../error/APIError.js";
import { ErrorReason } from "../error/ErrorReason.js";


export const addReqLimit = (reqIntervalMs) => {
    return rateLimit({
        windowMs: reqIntervalMs,
        max: 1, // Limit each IP to 1 requests per `window`
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
        handler: function (req, res) {
            res.status(429).json({[
                config.respErrorFieldName]: [
                    new APIError({
                        message: 'Too many requests, please try again later',
                        reason: ErrorReason.TOO_MANY_REQUESTS,
                        status: 429
                    })
                ]
            });
        }
    });
}