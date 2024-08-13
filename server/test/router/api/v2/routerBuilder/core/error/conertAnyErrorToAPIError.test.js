import convertAnyErrorToAPIError from "../../../../../../../router/api/v2/routeBuilder/core/error/convertAnyErrorToAPIError";
import { apiMultipleError, notAllowedAPIError, notFoundAPIError, notNumberAPIError, notStringAPIError, unexpectedAPIError } from "../../../../../../test_utils/data/apiErrors";
import { notNumberError, notStringError } from "../../../../../../test_utils/data/serviceErrors";

describe('convertAnyErrorToAPIError test suite', () => {
    it('Should return null if no error is provided', () => {
        const convertedError = convertAnyErrorToAPIError(null);

        expect(convertedError).toBeNull();
    });

    it('Should return null if an error is an empty array', () => {
        const convertedError = convertAnyErrorToAPIError([]);

        expect(convertedError).toBeNull();
    });

    it('Should return errors field array if its type is API_MULTIPLE_ERROR', () => {
        const apiMultipleErrorToConvert = {...apiMultipleError, errors: [ { some: 'error' } ]};

        const convertedError = convertAnyErrorToAPIError(apiMultipleErrorToConvert);

        expect(convertedError).toEqual(apiMultipleErrorToConvert.errors);
    });

    it('Should return error as it is if the error is an array of APIErrors', () => {
        const arrayOfAPIErrors = [notFoundAPIError, notAllowedAPIError];

        const convertedError = convertAnyErrorToAPIError(arrayOfAPIErrors);

        expect(convertedError).toEqual(arrayOfAPIErrors);
    });

    it('Should converts array of ServiceErrors to array of APIErrors', () => {
        const arrayOfServiceErrors = [notStringError, notNumberError];
        const arrayOfAPIErrors = [notStringAPIError, notNumberAPIError];

        const convertedError = convertAnyErrorToAPIError(arrayOfServiceErrors);

        expect(convertedError).toEqual(expect.arrayContaining(
            [ expect.objectContaining(arrayOfAPIErrors[0]), expect.objectContaining(arrayOfAPIErrors[1]) ]
        ));
    });

    it('Should converts ServiceError to APIError', () => {
        const convertedError = convertAnyErrorToAPIError(notStringError);
        expect(convertedError).toEqual(expect.objectContaining(notStringAPIError));
    });

    it('Should put unknown error to additional field and returns UNEXPECTED APIError', () => {
        const unknownError = new Error({message: 'This is unknown error', name: 'OtherError'});
        const convertedError = convertAnyErrorToAPIError(unknownError);
        expect(convertedError).toEqual(expect.objectContaining({...unexpectedAPIError, additional: unknownError}));
    });
});