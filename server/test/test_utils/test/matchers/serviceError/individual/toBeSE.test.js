import { SEReason } from "../../../../../../router/api/v2/routeBuilder/core/service/dataExtractors/error/SEReason";
import { ServiceError } from "../../../../../../router/api/v2/routeBuilder/core/service/dataExtractors/error/ServiceError";
import passJestThis from "../../../../jest_util/passJestThisObject";
import { toBeSE } from "../../../../matchers/serviceError/individual/toBeSE";

describe('toBeSE() test suite', () => {
    it('Should return object with field "pass" set to true if the param is expected ServiceError', () => {
        const expectedError = new ServiceError({ reason: SEReason.LIMIT_EXCEEDED });
        const receivedError = new ServiceError({ reason: SEReason.LIMIT_EXCEEDED });

        const resp = passJestThis(toBeSE)(receivedError, expectedError);

        expect(resp.pass).toBeTruthy();
    });

    it('Should return object with field "pass" set to false if the param is not expected ServiceError', () => {
        const expectedError = new ServiceError({ reason: SEReason.LIMIT_EXCEEDED });
        const receivedError = new ServiceError({ reason: SEReason.NOT_ALLOWED });

        const resp = passJestThis(toBeSE)(receivedError, expectedError);

        expect(resp.pass).toBeFalsy();
    });

    it('Should return object with field "pass" set to false if the param is not a ServiceError', () => {
        const expectedError = new ServiceError({ reason: SEReason.LIMIT_EXCEEDED });

        const resp = passJestThis(toBeSE)('not object', expectedError);

        expect(resp.pass).toBeFalsy();
    });

    it('Should throw TypeError if the expected value is not of type ServiceError', () => {
        const receivedError = new ServiceError({ reason: SEReason.NOT_ALLOWED });

        expect(() =>  passJestThis(toBeSE)(receivedError, 'not object')).toThrow(new TypeError("The expected value must be of type ServiceError"));
    });

    it('Should be properly registered as a custom jest matcher', () => {
        const validError = new ServiceError({ reason: SEReason.UNEXPECTED });
        const otherError = new ServiceError({ reason: SEReason.NOT_ALLOWED });

        expect(validError).toBeSE(validError);
        expect(otherError).not.toBeSE(validError);
    });
});