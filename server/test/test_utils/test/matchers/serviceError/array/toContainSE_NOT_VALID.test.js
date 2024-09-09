import { SEReason } from "../../../../../../router/api/v2/routeBuilder/core/service/dataExtractors/error/SEReason";
import { ServiceError } from "../../../../../../router/api/v2/routeBuilder/core/service/dataExtractors/error/ServiceError";
import passJestThis from "../../../../jest_util/passJestThisObject";
import { toContainSE_NOT_VALID } from "../../../../matchers/serviceError/array/toContainSE_NOT_VALID";

describe('toContainSE_NOT_VALID() test suite', () => {
    it('Should return object with pass field set to true if an array contains at least one ServiceError with reason NOT_VALID', () => {
        const arrayWithError = [ 
            new ServiceError({ reason: SEReason.NOT_VALID }), 
            new ServiceError({ reason: SEReason.NOT_ALLOWED }),  
            { type: 'not error' }
        ];

        const resp = passJestThis(toContainSE_NOT_VALID)(arrayWithError);

        expect(resp.pass).toBeTruthy();
    });

    it('Should return object with pass field set to false if an array does not contain at least one ServiceError with reason NOT_VALID', () => {
        const arrayWithoutError = [ 
            new ServiceError({ reason: SEReason.NOT_ALLOWED }),  
            { type: 'not error' }
        ];

        const resp = passJestThis(toContainSE_NOT_VALID)(arrayWithoutError);

        expect(resp.pass).toBeFalsy();
    });

    it('Should return object with pass field set to false if param is not an array', () => {
        const resp = passJestThis(toContainSE_NOT_VALID)('not array');

        expect(resp.pass).toBeFalsy();
    });

    it('Should be properly registered as a custom jest matcher', () => {
        const arrayWithError = [ 
            new ServiceError({ reason: SEReason.NOT_VALID }), 
            new ServiceError({ reason: SEReason.NOT_ALLOWED }),  
            { type: 'not error' }
        ];
        const arrayWithoutError = [ 
            new ServiceError({ reason: SEReason.NOT_ALLOWED }),  
            { type: 'not error' }
        ];

        expect(arrayWithError).toContainSE_NOT_VALID();
        expect(arrayWithoutError).not.toContainSE_NOT_VALID();
    });
});