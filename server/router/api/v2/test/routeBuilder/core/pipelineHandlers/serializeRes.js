import {serialize} from "./serialize.js";

/**
 *
 * @param{Record<string, boolean>} dtoShape object in {field: isExposed} form with fields to be exposed
 */
export const serializeRes = function (dtoShape){
    return serialize(dtoShape, 'res', null);
}