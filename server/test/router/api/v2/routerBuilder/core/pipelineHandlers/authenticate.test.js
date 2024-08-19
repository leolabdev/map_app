import { User } from "../../../../../../../router/api/v2/routeBuilder/core/authentication/User";
import { authenticate } from "../../../../../../../router/api/v2/routeBuilder/core/pipelineHandlers/authenticate";
import { invalidAuthTokenFormatAPIError, noAuthTokenAPIError } from "../../../../../../test_utils/data/apiErrors";

const userId = 1;
jest.mock('jsonwebtoken', () => {
    return {
        verify: () => ({id: userId})  
    };
});

describe('authenticate() test suite', () => {
    const authFieldName = 'user';
    const authHandler = authenticate(authFieldName);

    let reqMock = {
        headers: {
            authorization: null
        }
    }
    let resMock = {}
    let nextMock = jest.fn();
    
    it('Should throw AUTH_TOKEN_NOT_PROVIDED APIError if authorization header is not provided', () => {
        expect(() => authHandler(reqMock, resMock, nextMock)).toThrow(expect.objectContaining(noAuthTokenAPIError));
    });

    it('Should throw INVALID_AUTH_TOKEN_FORMAT APIError if authorization token is not in Bearer form', () => {
        reqMock.headers.authorization = 'invalid format';
        expect(() => authHandler(reqMock, resMock, nextMock)).toThrow(expect.objectContaining(invalidAuthTokenFormatAPIError));
    });

    it('Should set the user field in req object to User object with id returned from jwt.verify()', () => {
        const expectedUser = new User(userId);
        reqMock.headers.authorization = 'Bearer token';

        authHandler(reqMock, resMock, nextMock);

        expect(reqMock[authFieldName]).toEqual(expectedUser);
    });
});