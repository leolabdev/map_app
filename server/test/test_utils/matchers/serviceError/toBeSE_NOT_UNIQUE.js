import { SEReason } from "../../../../router/api/v2/routeBuilder/core/service/dataExtractors/error/SEReason";
import { ServiceError } from "../../../../router/api/v2/routeBuilder/core/service/dataExtractors/error/ServiceError";
import MatcherReturner from "../../jest_util/MatcherReturner";
import { isErrorWithReason } from "./isErrorWithReason";

/**
 * Jest matcher checks whenever provided param is ServiceError with reason NOT_UNIQUE
 * @param {*} object object to check
 * @returns {{ message: () => string, pass: boolean }}
 */
export function toBeSE_NOT_UNIQUE(object) {
    const returner = new MatcherReturner({received: object, utils: this.utils});

    if(!(object instanceof ServiceError))
        return returner.passFalse('Received object is not of type ServiceError');

    const isValid = isErrorWithReason(object, SEReason.NOT_UNIQUE);

    return isValid ? 
        returner.passTrue('Expected to not receive a ServiceError with reason NOT_UNIQUE') :
        returner.passFalse('Expected to receive ServiceError with reason NOT_UNIQUE');
}

expect.extend({toBeSE_NOT_UNIQUE});