import { User } from "../../../../../../../router/api/v2/routeBuilder/core/authentication/User";
import { authorize } from "../../../../../../../router/api/v2/routeBuilder/core/pipelineHandlers/authorize";
import { createAsyncHandler } from "../../../../../../../router/api/v2/routeBuilder/core/util/createAsyncHandler";
import { apiError, notAuthenticatedAPIError, notAuthorizedAPIError } from "../../../../../../test_utils/data/apiErrors";

jest.mock("../../../../../../../router/api/v2/routeBuilder/core/util/createAsyncHandler");

describe('authorize() test suite', () => {
    const authFieldName = 'user';

    let reqMock = { [authFieldName]: null };
    let resMock = {};
    let nextMock = jest.fn();
    
    it('Should throw NOT_AUTHENTICATED APIError if user field is not defined in the req object', async () => {
        createAsyncHandler.mockImplementation((fn) => { 
            return () => {
                return fn(reqMock, resMock, nextMock);
            }; 
        });
    
        const authHandler = authorize(authFieldName, null, null, null);
        async function callAuthHandler() {
            try {
                return await authHandler();
            } catch (error) {
                return error;
            }
        }

        const resp = await callAuthHandler();
        expect(resp).toEqual(expect.objectContaining(notAuthenticatedAPIError));
    });

    it('Should throws NOT_AUTHORIZED APIError if isAllowedFn returns false', async () => {
        reqMock[authFieldName] = new User(1);
        createAsyncHandler.mockImplementation((fn) => { 
            return () => {
                return fn(reqMock, resMock, nextMock);
            }; 
        });
    
        const authHandler = authorize(authFieldName, null, null, () => false);
        async function callAuthHandler() {
            try {
                return await authHandler();
            } catch (error) {
                return error;
            }
        }

        const resp = await callAuthHandler();
        expect(resp).toEqual(expect.objectContaining(notAuthorizedAPIError));
    });

    it('Should calls next() if authorized', async () => {
        reqMock[authFieldName] = new User(1);
        createAsyncHandler.mockImplementation((fn) => { 
            return () => {
                return fn(reqMock, resMock, nextMock);
            }; 
        });
    
        const authHandler = authorize(authFieldName, null, null, () => true);
        async function callAuthHandler() {
            try {
                return await authHandler();
            } catch (error) {
                return error;
            }
        }

        const resp = await callAuthHandler();
        expect(resp).not.toEqual(expect.objectContaining(apiError));
        expect(nextMock).toHaveBeenCalledTimes(1);
    });
});