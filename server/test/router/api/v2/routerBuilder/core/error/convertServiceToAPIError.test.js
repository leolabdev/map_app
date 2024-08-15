import { convertServiceToAPIError } from "../../../../../../../router/api/v2/routeBuilder/core/error/convertServiceToAPIError";
import { notStringAPIError, notUniqueAPIError, unexpectedAPIError } from "../../../../../../test_utils/data/apiErrors";
import { notStringError, notUniqueError } from "../../../../../../test_utils/data/serviceErrors";

describe('convertServiceToAPIError() test suite', () => {
    it('Should convert NOT_STRING ServiceError to appropriate APIError', () => {
        const convertedError = convertServiceToAPIError(notStringError);

        expect(convertedError).toEqual(expect.objectContaining(notStringAPIError));
    });

    it('Should convert NOT_STRING ServiceError to appropriate APIError', () => {
        const convertedError = convertServiceToAPIError(notUniqueError);

        expect(convertedError).toEqual(expect.objectContaining(notUniqueAPIError));
    });

    it('Should return UNEXPECTED error if the provided error is not a ServiceError and put it to the additional field', () => {
        const notServiceError = new Error({message: 'This is not a ServiceError'});
        const convertedError = convertServiceToAPIError(notServiceError);

        expect(convertedError).toEqual(expect.objectContaining({...unexpectedAPIError, additional: notServiceError}));
    });
});