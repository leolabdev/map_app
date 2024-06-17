import rateLimit from "express-rate-limit";


export const addReqLimit = (reqIntervalMs) => {
    return rateLimit({
        windowMs: reqIntervalMs,
        max: 1, // Limit each IP to 1 requests per `window`
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
        handler: function (req, res) {
            res.status(429).json({error: "Too many requests, please try again later."});
        }
    });
}