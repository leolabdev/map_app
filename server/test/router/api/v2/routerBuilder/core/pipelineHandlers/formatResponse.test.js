import { formatResponse } from "../../../../../../../router/api/v2/routeBuilder/core/pipelineHandlers/formatResponse";
import { notBooleanAPIError, notFoundAPIError } from "../../../../../../test_utils/data/apiErrors";
import ProfileGenerator from "../../../../../../test_utils/data/ProfileGenerator";

describe('formatResponse() test suite', () => {
    const respFieldName = 'data';
    const respErrorFieldName = 'errors';
    const successStatus = 201;
    const profileGen = new ProfileGenerator();
    const returnedData = profileGen.create();
    const returnedErrors = [notBooleanAPIError, notFoundAPIError];

    const reqMock = {
        
    }
    const resMock = {
        [respFieldName]: returnedData,
        [respErrorFieldName]: returnedErrors,
        json: jest.fn()
    }
    const formatResponseHandler = formatResponse(respFieldName, respErrorFieldName, successStatus);

    it('Should call res.json() with formatted response object in valid form', () => {
        formatResponseHandler(reqMock, resMock);

        expect(resMock.json).toHaveBeenCalledTimes(1);
        expect(resMock.json).toHaveBeenCalledWith({
            [respFieldName]: returnedData,
            [respErrorFieldName]: returnedErrors
        });
    });

    it('Should set the provided status code in res object "statusCode" field', () => {
        formatResponseHandler(reqMock, resMock);

        expect(resMock.statusCode).toEqual(successStatus);
    });

    it('Should remove "respFieldName", "respErrorFieldName", "metadataFieldName" from res object after execution', () => {
        formatResponseHandler(reqMock, resMock);

        expect(resMock).not.toEqual(expect.objectContaining({
            [respFieldName]: expect.anything(),
            [respErrorFieldName]: expect.anything()
        }));
    });
});