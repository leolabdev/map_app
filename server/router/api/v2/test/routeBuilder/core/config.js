export const config = Object.freeze(
    {
        respFieldName: 'data',
        respErrorFieldName: 'errors',
        authFieldName: 'user',
        respStatusFieldName: 'statusToSend'
    }
);

export const API_ERROR_TYPE_NAME = Symbol('APIError');