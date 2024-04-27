import {serialize} from "./serialize.js";

/**
 *
 * @param {string} respFieldName
 * @param{Record<string, boolean>} dtoShape object in {field: isExposed} form with fields to be exposed
 */
export const serializeRes = function (respFieldName, dtoShape){
    return serialize(respFieldName, dtoShape, 'res', null);
}