import { SEReason } from "../../../../../router/api/v2/routeBuilder/core/service/dataExtractors/error/SEReason";
import { ServiceError } from "../../../../../router/api/v2/routeBuilder/core/service/dataExtractors/error/ServiceError";
import passJestThis from "../../../jest_util/passJestThisObject";
import { toBeSE_NOT_UNIQUE } from "../../../matchers/serviceError/toBeSE_NOT_UNIQUE";

describe('toBeSE_NOT_UNIQUE() test suite', () => {
    it('Should return object with pass equal to true if the object is ServiceError NOT_UNIQUE', () => {
        const validError = new ServiceError({ reason: SEReason.NOT_UNIQUE });

        const isError = passJestThis(toBeSE_NOT_UNIQUE)(validError);

        expect(isError.pass).toBeTruthy();
    });

    it('Should return object with pass equal to false if the object is ServiceError without reason NOT_UNIQUE', () => {
        const otherError = new ServiceError({ reason: SEReason.NOT_ALLOWED });

        const isError = passJestThis(toBeSE_NOT_UNIQUE)(otherError);

        expect(isError.pass).toBeFalsy();
    });

    it('Should return object with pass equal to false if the object is not of type ServiceError', () => {
        const resp = passJestThis(toBeSE_NOT_UNIQUE)({type: 'not service error'});

        expect(resp.pass).toBeFalsy();
    });

    it('Should be properly registered as a custom jest matcher', () => {
        const validError = new ServiceError({ reason: SEReason.NOT_UNIQUE });
        const invalidError = new ServiceError({ reason: SEReason.NOT_ALLOWED });

        expect(validError).toBeSE_NOT_UNIQUE();
        expect(invalidError).not.toBeSE_NOT_UNIQUE();
    });
});