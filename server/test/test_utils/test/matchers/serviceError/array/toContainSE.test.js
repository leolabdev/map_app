import { SEReason } from "../../../../../../router/api/v2/routeBuilder/core/service/dataExtractors/error/SEReason";
import { ServiceError } from "../../../../../../router/api/v2/routeBuilder/core/service/dataExtractors/error/ServiceError";
import passJestThis from "../../../../jest_util/passJestThisObject";
import toContainSE from "../../../../matchers/serviceError/array/toContainSE";

describe('toContainerSE() test suite', () => {
    it('Should return object with pass field set to true if all specified errors are found', () => {
        const errorsToFind = [
            new ServiceError({ reason: SEReason.NOT_ALLOWED }),
            new ServiceError({ reason: SEReason.NOT_ARRAY }),
            new ServiceError({ reason: SEReason.MISCONFIGURED })
        ];
        const inputArray = [ 23, ...errorsToFind, {type: 'not error'}, 'some str' ];

        const resp = passJestThis(toContainSE)(inputArray, errorsToFind);

        expect(resp.pass).toBeTruthy();
    });

    it('Should return object with pass field set to false if not all specified errors are found', () => {
        const errorsToFind = [
            new ServiceError({ reason: SEReason.NOT_ALLOWED }),
            new ServiceError({ reason: SEReason.NOT_ARRAY }),
            new ServiceError({ reason: SEReason.MISCONFIGURED })
        ];
        const inputArray = [ errorsToFind[0], errorsToFind[2] ];

        const resp = passJestThis(toContainSE)(inputArray, errorsToFind);

        expect(resp.pass).toBeFalsy();
    });

    it('Should return object with pass field set to false if provided param is not an array', () => {
        const errorsToFind = [
            new ServiceError({ reason: SEReason.NOT_ALLOWED }),
            new ServiceError({ reason: SEReason.NOT_ARRAY }),
            new ServiceError({ reason: SEReason.MISCONFIGURED })
        ];
        const resp = passJestThis(toContainSE)(45, errorsToFind);

        expect(resp.pass).toBeFalsy();
    });

    it('Should be properly registered as a custom jest matcher', () => {
        const errorsToFind = [
            new ServiceError({ reason: SEReason.NOT_ALLOWED }),
            new ServiceError({ reason: SEReason.NOT_ARRAY }),
            new ServiceError({ reason: SEReason.MISCONFIGURED })
        ];
        const inputArray = [ 23, ...errorsToFind, {type: 'not error'}, 'some str' ];

        expect(inputArray).toContainSE(errorsToFind);
    });

    it('Should be properly registered as a custom jest matcher for not', () => {
        const errorsNotToFind = [
            new ServiceError({ reason: SEReason.NOT_ALLOWED }),
            new ServiceError({ reason: SEReason.NOT_ARRAY }),
            new ServiceError({ reason: SEReason.MISCONFIGURED })
        ];
        const inputArray = [ 23, {type: 'not error'}, 'some str' ];

        expect(inputArray).not.toContainSE(errorsNotToFind);
    });
});