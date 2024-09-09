import { SEReason } from "../../../../../../router/api/v2/routeBuilder/core/service/dataExtractors/error/SEReason";
import { ServiceError } from "../../../../../../router/api/v2/routeBuilder/core/service/dataExtractors/error/ServiceError";
import passJestThis from "../../../../jest_util/passJestThisObject";
import { toBeSE_NOT_VALID } from "../../../../matchers/serviceError/individual/toBeSE_NOT_VALID";

describe('toBeSE_NOT_VALID() test suite', () => {  
    it('Should return object with pass equal to true if the object is ServiceError NOT_VALID', () => {
        const validError = new ServiceError({ reason: SEReason.NOT_VALID });

        const resp = passJestThis(toBeSE_NOT_VALID)(validError);

        expect(resp.pass).toBeTruthy();
    });

    it('Should return object with pass equal to false if the object is ServiceError without reason NOT_VALID', () => {
        const otherError = new ServiceError({ reason: SEReason.NOT_ALLOWED });

        const resp = passJestThis(toBeSE_NOT_VALID)(otherError);

        expect(resp.pass).toBeFalsy();
    });

    it('Should return object with pass equal to false if the object is not of type ServiceError', () => {
        const resp = passJestThis(toBeSE_NOT_VALID)({type: 'not service error'});

        expect(resp.pass).toBeFalsy();
    });

    it('Should be properly registered as a custom jest matcher', () => {
        const validError = new ServiceError({ reason: SEReason.NOT_VALID });
        const invalidError = new ServiceError({ reason: SEReason.NOT_ALLOWED });

        expect(validError).toBeSE_NOT_VALID();
        expect(invalidError).not.toBeSE_NOT_VALID();
    });
});