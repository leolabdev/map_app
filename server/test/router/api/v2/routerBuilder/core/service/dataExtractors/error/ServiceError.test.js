import { SERVICE_ERROR_TYPE_NAME } from "../../../../../../../../../router/api/v2/routeBuilder/core/config";
import { ServiceError } from "../../../../../../../../../router/api/v2/routeBuilder/core/service/dataExtractors/error/ServiceError";

describe('ServiceError class test suite', () => {
    describe('constructor', () => {
        it('Should create a valid ServiceError object with valid type field', () => {
            const error = new ServiceError({});

            expect(error.type).toBe(SERVICE_ERROR_TYPE_NAME.description);
        });
    });
});