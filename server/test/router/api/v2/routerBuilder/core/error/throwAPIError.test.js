import MultipleError from "../../../../../../../router/api/v2/routeBuilder/core/error/MultipleError";
import throwAPIError from "../../../../../../../router/api/v2/routeBuilder/core/error/throwAPIError";
import { notBooleanAPIError, notStringAPIError } from "../../../../../../test_utils/data/apiErrors";
import { notBooleanError, notStringError } from "../../../../../../test_utils/data/serviceErrors";

describe('throwAPIError() test suite', () => {
    it('Should convert the provided error to APIError and throw it', () => {
        expect(() => throwAPIError(notStringError)).toThrow(expect.objectContaining(notStringAPIError));
    });

    it('Should throw MultipleError if the param is array containing converted to APIError errors', () => {
        const errors = [notStringError, notBooleanError];
        const expected = new MultipleError(errors);
        const expectedErrors = [notStringAPIError, notBooleanAPIError];

        expect(() => throwAPIError(errors)).toThrow(
            expect.objectContaining({
                ...expected,
                errors: expect.arrayContaining([
                    expect.objectContaining(expectedErrors[0]), 
                    expect.objectContaining(expectedErrors[1])
                ])
            })
        );
    });

    it('Should not throw and do anything if provided param is not ServiceError or ServiceError[]', () => {
        const notServiceError = new Error({message: 'Not ServiceError'});
        expect(() => throwAPIError(notServiceError)).not.toThrow();
    });
});