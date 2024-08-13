import { APIError } from "../../../../../../../router/api/v2/routeBuilder/core/error/APIError";
import { ErrorName } from "../../../../../../../router/api/v2/routeBuilder/core/error/ErrorName";
import { ErrorReason } from "../../../../../../../router/api/v2/routeBuilder/core/error/ErrorReason";
import { notFoundAPIError, notStringAPIError, unexpectedAPIError } from "../../../../../../test_utils/data/apiErrors";

describe('APIError test suite', () => {
    describe('constructor', () => {
        it('Should set the reason to UNEXPECTED and the message to "Unexpected server error occurred" by default', () => {
            const defaultAPIError = new APIError({});

            expect(defaultAPIError).toEqual(expect.objectContaining(unexpectedAPIError));
        });

        it('Should set the name to BAD_REQUEST and the status to 400 for provided NOT_STRING reason', () => {
            const createdAPIError = new APIError({ reason: ErrorReason.NOT_STRING });

            expect(createdAPIError).toEqual(expect.objectContaining(notStringAPIError));
        });

        it('Should set the name to NOT_FOUND and the status to 404 for provided NOT_FOUND reason', () => {
            const createdAPIError = new APIError({ reason: ErrorReason.NOT_FOUND });

            expect(createdAPIError).toEqual(expect.objectContaining(notFoundAPIError));
        });

        it('Should set the name to UNEXPECTED if the provided reason is not valid', () => {
            const createdAPIError = new APIError({ reason: 'non-existing' });

            expect(createdAPIError).toEqual(expect.objectContaining({name: ErrorName.UNEXPECTED}));
        });

        it('Should creates a valid object if all fields are specified', () => {
            const fieldsToSet = {
                name: ErrorName.BAD_REQUEST, reason:  ErrorReason.NOT_BOOLEAN, status: 400,
                location:  'body', message:  'It is not a boolean', endpoint:  '/some/endpoint',
                field: 'name', additional: null
            }
            const createdAPIError = new APIError(fieldsToSet);

            expect(createdAPIError).toEqual(expect.objectContaining(fieldsToSet));
        });
    });
});