import { API_MULTIPLE_ERROR } from "../../../../../../../router/api/v2/routeBuilder/core/config";
import MultipleError from "../../../../../../../router/api/v2/routeBuilder/core/error/MultipleError";
import { notFoundAPIError } from "../../../../../../test_utils/data/apiErrors";
import { notStringError } from "../../../../../../test_utils/data/serviceErrors";

describe('MultipleError class test suite', () => {
    describe('constructor()', () => {
        it('Should create object with type set to API_MULTIPLE_ERROR and status to null if no params provided', () => {
            const errorDefaultShape = {type: API_MULTIPLE_ERROR, status: null};
            const errorObj = new MultipleError();
            expect(errorObj).toEqual(expect.objectContaining(errorDefaultShape));
        });

        it('Should create valid MultipleError object when all fields are specified', () => {
            const errors = [ notFoundAPIError, new Error({message: 'some error'}), notStringError ];
            const status = 400;

            const errorObj = new MultipleError(errors, status);
            expect(errorObj).toEqual(expect.objectContaining({errors, status}));
        });
    });
});