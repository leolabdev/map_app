import isAPIError from "../../../../../../../router/api/v2/routeBuilder/core/error/isAPIError";
import { notBooleanAPIError } from "../../../../../../test_utils/data/apiErrors";

describe('isAPIError() test suite', () => {
    it('Should return true if the provided error is an APIError', () => {
        const isAPI = isAPIError(notBooleanAPIError);
        expect(isAPI).toBeTruthy();
    });

    it('Should return false if the provided error is not an APIError', () => {
        const notAPIError = new Error({message: 'Not API error', name: 'APIError'});
        const isAPI = isAPIError(notAPIError);
        expect(isAPI).toBeFalsy();
    });
});