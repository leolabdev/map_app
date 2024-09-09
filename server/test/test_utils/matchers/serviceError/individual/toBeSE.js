import { SEReason } from "../../../../../router/api/v2/routeBuilder/core/service/dataExtractors/error/SEReason";
import { ServiceError } from "../../../../../router/api/v2/routeBuilder/core/service/dataExtractors/error/ServiceError";
import MatcherReturner from "../../../jest_util/MatcherReturner";
import { isErrorWithReason } from "../isErrorWithReason";
import isSEReason from "../isSEReason";

/**
 * Jest matcher checks whenever object has the provided ServiceError reason or not.
 * @param {*} received object to check
 * @param {SEReason} expected expected ServiceError reason
 * @returns {{ message: () => string, pass: boolean }}
 */
export function toBeSE(received, expected) {
    if(!isSEReason(expected))
        throw new TypeError('The expected value must be of type SEReason');

    const returner = new MatcherReturner({received, utils: this.utils, expected});
    
    if(!(received instanceof ServiceError))
        return returner.passFalse('Received object is not of type ServiceError');

    const isValid = isErrorWithReason(received, expected);

    return isValid ?
        returner.passTrue(`Expected to not receive a ServiceError with reason ${expected.reason}`) :
        returner.passFalse(`Expected to receive ServiceError with reason ${expected.reason}`);
}

expect.extend({toBeSE});