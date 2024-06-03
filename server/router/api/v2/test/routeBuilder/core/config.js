import {DataExtractorType} from "./service/dataExtractors/DataExtractorType.js";

export const config = Object.freeze(
    {
        respFieldName: 'data',
        respErrorFieldName: 'errors',
        authFieldName: 'user',
        respStatusFieldName: 'statusToSend'
    }
);

export const API_ERROR_TYPE_NAME = Symbol('APIError');
export const API_MULTIPLE_ERROR = 'APIMultipleError';

export const DATA_EXTRACTOR_TYPE = Symbol(DataExtractorType.SEQUELIZE);
export const SERVICE_ERROR_TYPE_NAME = Symbol('ServiceError');