import { config } from "../../../../../../../router/api/v2/routeBuilder/core/config";
import { commonErrorCatcher } from "../../../../../../../router/api/v2/routeBuilder/core/middleware/commonErrorCatcher";
import { notFoundAPIError } from "../../../../../../test_utils/data/apiErrors";

describe('commonErrorCatcher() test suite', () => {
    it('Should call the res.json() with { [respErrorFieldName]: [error] } param', () => {
        const resMock = {
            json: jest.fn()
        }
        const {respErrorFieldName} = config; 
        const expectedParam = { [respErrorFieldName]: [notFoundAPIError]};

        commonErrorCatcher(notFoundAPIError, {}, resMock, jest.fn());

        expect(resMock.json).toHaveBeenCalledWith(expectedParam);
    });
});