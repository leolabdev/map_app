export const ErrorReason = Object.freeze({
    NOT_FOUND: 'NOT_FOUND',

    BAD_REQUEST: 'BAD_REQUEST',

    VALIDATION: 'VALIDATION',
    NOT_STRING: 'NOT_STRING',
    NOT_NUMBER: 'NOT_NUMBER',
    NOT_BOOLEAN: 'NOT_BOOLEAN',

    NOT_AUTHENTICATED: 'NOT_AUTHENTICATED',
    AUTH_TOKEN_NOT_PROVIDED: 'AUTH_TOKEN_NOT_PROVIDED',
    INVALID_AUTH_TOKEN_FORMAT: 'INVALID_AUTH_TOKEN_FORMAT',
    INVALID_AUTH_TOKEN: 'INVALID_AUTH_TOKEN',
    AUTHENTICATION_FAILED: 'AUTHENTICATION_FAILED',
    WRONG_CREDENTIALS: 'WRONG_CREDENTIALS',

    NOT_AUTHORIZED: 'NOT_AUTHORIZED',

    TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',

    SERVER_MISCONFIGURED: 'SERVER_MISCONFIGURED',
    SERVER_ERROR: 'SERVER_ERROR',

    UNEXPECTED: 'UNEXPECTED'
});