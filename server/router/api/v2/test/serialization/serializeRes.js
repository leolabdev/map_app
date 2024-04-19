import {serialize} from "./serialize.js";

/**
 *
 * @param{Record<string, boolean>} dtoShape object in {field: isExposed} form with fields to be exposed
 * @param{string?} field field in response object containing object to be serialized. 'result' is default
 */
export const serializeRes = function (dtoShape){
    return serialize(dtoShape, 'res', null);
}