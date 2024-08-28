import { createAsyncHandler } from "../../../../../../../router/api/v2/routeBuilder/core/util/createAsyncHandler";

describe('createAsyncHandler() test suite', () => {
    function dummyHandler() {}
    it('Should return returns function of type (req, res, next) => Promise', () => {
        const returnedFn = createAsyncHandler(dummyHandler);

        const fnResult = returnedFn();

        expect(typeof returnedFn).toBe('function');
        expect(returnedFn.length).toBe(3);
        expect(fnResult).toBeInstanceOf(Promise);
    });
});