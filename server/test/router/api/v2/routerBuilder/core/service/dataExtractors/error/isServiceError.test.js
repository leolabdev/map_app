import isServiceError from "../../../../../../../../../router/api/v2/routeBuilder/core/service/dataExtractors/error/isServiceError";
import { requiredError } from "../../../../../../../../test_utils/data/serviceErrors";

describe('isServiceError() test suite', () => {
    it('Should return true if provided param is ServiceError object', () => {
        const isError = isServiceError(requiredError);
        expect(isError).toBeTruthy();
    });
});