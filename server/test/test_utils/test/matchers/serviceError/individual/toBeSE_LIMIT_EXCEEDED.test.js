import { SEReason } from "../../../../../../router/api/v2/routeBuilder/core/service/dataExtractors/error/SEReason";
import { ServiceError } from "../../../../../../router/api/v2/routeBuilder/core/service/dataExtractors/error/ServiceError";
import passJestThis from "../../../../jest_util/passJestThisObject";
import { toBeSE_LIMIT_EXCEEDED } from "../../../../matchers/serviceError/individual/toBeSE_LIMIT_EXCEEDED";

describe('toBeSE_LIMIT_EXCEEDED() test suite', () => {  
    it('Should return object with pass equal to true if the object is ServiceError LIMIT_EXCEEDED', () => {
        const validError = new ServiceError({ reason: SEReason.LIMIT_EXCEEDED });

        const resp = passJestThis(toBeSE_LIMIT_EXCEEDED)(validError);

        expect(resp.pass).toBeTruthy();
    });

    it('Should return object with pass equal to false if the object is ServiceError without reason LIMIT_EXCEEDED', () => {
        const otherError = new ServiceError({ reason: SEReason.NOT_ALLOWED });

        const resp = passJestThis(toBeSE_LIMIT_EXCEEDED)(otherError);

        expect(resp.pass).toBeFalsy();
    });

    it('Should return object with pass equal to false if the object is not of type ServiceError', () => {
        const resp = passJestThis(toBeSE_LIMIT_EXCEEDED)({type: 'not service error'});

        expect(resp.pass).toBeFalsy();
    });

    it('Should be properly registered as a custom jest matcher', () => {
        const validError = new ServiceError({ reason: SEReason.LIMIT_EXCEEDED });
        const invalidError = new ServiceError({ reason: SEReason.NOT_ALLOWED });

        expect(validError).toBeSE_LIMIT_EXCEEDED();
        expect(invalidError).not.toBeSE_LIMIT_EXCEEDED();
    });
});