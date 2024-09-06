import { SEReason } from "../../../../../router/api/v2/routeBuilder/core/service/dataExtractors/error/SEReason";
import { ServiceError } from "../../../../../router/api/v2/routeBuilder/core/service/dataExtractors/error/ServiceError";
import passJestThis from "../../../jest_util/passJestThisObject";
import { toBeSE_NOT_ALLOWED } from "../../../matchers/serviceError/toBeSE_NOT_ALLOWED";

describe('toBeSE_NOT_ALLOWED() test suite', () => {
    it('Should return object with pass equal to true if the object is ServiceError NOT_ALLOWED', () => {
        const notFoundErr = new ServiceError({ reason: SEReason.NOT_ALLOWED });

        const isError = passJestThis(toBeSE_NOT_ALLOWED)(notFoundErr);

        expect(isError.pass).toBeTruthy();
    });

    it('Should return object with pass equal to false if the object is ServiceError without reason NOT_ALLOWED', () => {
        const notArrayErr = new ServiceError({ reason: SEReason.NOT_ARRAY });

        const isError = passJestThis(toBeSE_NOT_ALLOWED)(notArrayErr);

        expect(isError.pass).toBeFalsy();
    });

    it('Should return object with pass equal to false if the object is not of type ServiceError', () => {
        const isError = passJestThis(toBeSE_NOT_ALLOWED)({type: 'not service error'});

        expect(isError.pass).toBeFalsy();
    });

    it('Should be properly registered as a custom jest matcher', () => {
        const notAllowedErr = new ServiceError({ reason: SEReason.NOT_ALLOWED });
        const notFoundErr = new ServiceError({ reason: SEReason.NOT_FOUND });

        expect(notAllowedErr).toBeSE_NOT_ALLOWED();
        expect(notFoundErr).not.toBeSE_NOT_ALLOWED();
    });
});