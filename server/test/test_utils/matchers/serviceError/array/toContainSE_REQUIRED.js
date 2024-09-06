import { SEReason } from "../../../../../router/api/v2/routeBuilder/core/service/dataExtractors/error/SEReason";
import MatcherReturner from "../../../jest_util/MatcherReturner";
import { isErrorWithReason } from "../isErrorWithReason";

/**
 * Jest matcher checks whenever provided param is an array 
 * containing at least one ServiceError with reason REQUIRED
 * @param {*} object object to check
 * @returns {{ message: () => string, pass: boolean }}
 */
export function toContainSE_REQUIRED(object) {
    const returner = new MatcherReturner({received: object, utils: this.utils});

    if(!object || !Array.isArray(object))
        return returner.passFalse('Received object is not array');
    
    const isValid = object.find(item => isErrorWithReason(item, SEReason.REQUIRED));

    return isValid ?
        returner.passTrue('Expected to not receive an array containing any ServiceErrors with reason REQUIRED') :
        returner.passFalse('Expected to receive an array containing at least one ServiceError with reason REQUIRED')
}

expect.extend({toContainSE_REQUIRED});