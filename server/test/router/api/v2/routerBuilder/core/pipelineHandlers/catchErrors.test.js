import { catchErrors } from "../../../../../../../router/api/v2/routeBuilder/core/pipelineHandlers/catchErrors";
import { notAllowedAPIError, notFoundAPIError } from "../../../../../../test_utils/data/apiErrors";

describe('catchErrors() test suite', () => {
    const respErrorFieldName = 'errors';

    it('Should set the specified respErrorFieldName field to array with caught APIErrors', () => {
        const reqMock = {}
        const resMock = {}
        const nextMock = jest.fn();
        const apiErrors = [ notFoundAPIError, notAllowedAPIError ];

        const errorCatcher = catchErrors(respErrorFieldName);

        errorCatcher(apiErrors, reqMock, resMock, nextMock);

        expect(resMock[respErrorFieldName]).toEqual(apiErrors);
    });
});