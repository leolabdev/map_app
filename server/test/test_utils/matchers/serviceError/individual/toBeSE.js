import { SERVICE_ERROR_TYPE_NAME } from "../../../../../router/api/v2/routeBuilder/core/config";
import { ServiceError } from "../../../../../router/api/v2/routeBuilder/core/service/dataExtractors/error/ServiceError";
import MatcherReturner from "../../../jest_util/MatcherReturner";
import { isErrorWithReason } from "../isErrorWithReason";

/**
 * Jest matcher checks whenever object is the provided ServiceError or not.
 * @param {*} received object to check
 * @param {ServiceError} expected expected ServiceError
 * @returns {{ message: () => string, pass: boolean }}
 */
export function toBeSE(received, expected) {
    if(!expected || expected.type !== SERVICE_ERROR_TYPE_NAME.description)
        throw new TypeError('The expected value must be of type ServiceError');

    const returner = new MatcherReturner({received, utils: this.utils, expected});
    
    if(!(received instanceof ServiceError))
        return returner.passFalse('Received object is not of type ServiceError');

    const isValid = isErrorWithReason(received, expected.reason);

    return isValid ?
        returner.passTrue(`Expected to not receive a ServiceError with reason ${expected.reason}`) :
        returner.passFalse(`Expected to receive ServiceError with reason ${expected.reason}`);
}

expect.extend({toBeSE});