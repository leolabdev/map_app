import { SEReason } from "../../../../../../router/api/v2/routeBuilder/core/service/dataExtractors/error/SEReason";
import { ServiceError } from "../../../../../../router/api/v2/routeBuilder/core/service/dataExtractors/error/ServiceError";
import passJestThis from "../../../../jest_util/passJestThisObject";
import { toContainSE_LIMIT_EXCEEDED } from "../../../../matchers/serviceError/array/toContainSE_LIMIT_EXCEEDED";

describe('toContainSE_LIMIT_EXCEEDED() test suite', () => {
    it('Should return object with pass field set to true if an array contains at least one ServiceError with reason LIMIT_EXCEEDED', () => {
        const arrayWithError = [ 
            new ServiceError({ reason: SEReason.LIMIT_EXCEEDED }), 
            new ServiceError({ reason: SEReason.NOT_ALLOWED }),  
            { type: 'not error' }
        ];

        const resp = passJestThis(toContainSE_LIMIT_EXCEEDED)(arrayWithError);

        expect(resp.pass).toBeTruthy();
    });

    it('Should return object with pass field set to false if an array does not contain at least one ServiceError with reason LIMIT_EXCEEDED', () => {
        const arrayWithoutError = [ 
            new ServiceError({ reason: SEReason.NOT_ALLOWED }),  
            { type: 'not error' }
        ];

        const resp = passJestThis(toContainSE_LIMIT_EXCEEDED)(arrayWithoutError);

        expect(resp.pass).toBeFalsy();
    });

    it('Should return object with pass field set to false if param is not an array', () => {
        const resp = passJestThis(toContainSE_LIMIT_EXCEEDED)('not array');

        expect(resp.pass).toBeFalsy();
    });

    it('Should be properly registered as a custom jest matcher', () => {
        const arrayWithError = [ 
            new ServiceError({ reason: SEReason.LIMIT_EXCEEDED }), 
            new ServiceError({ reason: SEReason.NOT_ALLOWED }),  
            { type: 'not error' }
        ];
        const arrayWithoutError = [ 
            new ServiceError({ reason: SEReason.NOT_ALLOWED }),  
            { type: 'not error' }
        ];

        expect(arrayWithError).toContainSE_LIMIT_EXCEEDED();
        expect(arrayWithoutError).not.toContainSE_LIMIT_EXCEEDED();
    });
});