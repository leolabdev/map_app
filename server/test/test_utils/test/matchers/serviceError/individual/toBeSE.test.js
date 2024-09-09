import { SEReason } from "../../../../../../router/api/v2/routeBuilder/core/service/dataExtractors/error/SEReason";
import { ServiceError } from "../../../../../../router/api/v2/routeBuilder/core/service/dataExtractors/error/ServiceError";
import passJestThis from "../../../../jest_util/passJestThisObject";
import { toBeSE } from "../../../../matchers/serviceError/individual/toBeSE";

describe('toBeSE() test suite', () => {
    it('Should return object with field "pass" set to true if the param has an expected SE reason', () => {
        const expectedReason = SEReason.LIMIT_EXCEEDED;
        const receivedError = new ServiceError({ reason: expectedReason });

        const resp = passJestThis(toBeSE)(receivedError, expectedReason);

        expect(resp.pass).toBeTruthy();
    });

    it('Should return object with field "pass" set to false if the param has an expected SE reason', () => {
        const receivedError = new ServiceError({ reason: SEReason.NOT_ALLOWED });

        const resp = passJestThis(toBeSE)(receivedError, SEReason.LIMIT_EXCEEDED);

        expect(resp.pass).toBeFalsy();
    });

    it('Should return object with field "pass" set to false if the param is not a ServiceError', () => {
        const resp = passJestThis(toBeSE)('not object', SEReason.LIMIT_EXCEEDED);

        expect(resp.pass).toBeFalsy();
    });

    it('Should throw TypeError if the expected value is not of type SEReason', () => {
        const receivedError = new ServiceError({ reason: SEReason.NOT_ALLOWED });

        expect(() => passJestThis(toBeSE)(receivedError, 'not object')).toThrow(new TypeError("The expected value must be of type SEReason"));
    });

    it('Should be properly registered as a custom jest matcher', () => {
        const unexpectedError = new ServiceError({ reason: SEReason.UNEXPECTED });
        const notAllowedError = new ServiceError({ reason: SEReason.NOT_ALLOWED });

        expect(unexpectedError).toBeSE(SEReason.UNEXPECTED);
        expect(notAllowedError).not.toBeSE(SEReason.UNEXPECTED);
    });
});