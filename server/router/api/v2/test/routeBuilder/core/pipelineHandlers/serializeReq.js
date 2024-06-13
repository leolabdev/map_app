import {serialize} from "./serialize.js";

/**
 *
 * @param {string} respFieldName
 * @param{Record<string, boolean>} dtoShape object in {field: isExposed} form with fields to be exposed
 * @param{string?} field field in request object containing object to be serialized. 'body' is default
 */
export const serializeReq = function (respFieldName, dtoShape, field='body'){
    return serialize(respFieldName, dtoShape, 'req', field);
}