import Joi from "joi";
import { profile1 } from "../../../../../../test_utils/data/profiles";
import validate from "../../../../../../../router/api/v2/routeBuilder/core/pipelineHandlers/validate";
import { apiMultipleError, serverMisconfiguredAPIError } from "../../../../../../test_utils/data/apiErrors";
import { createAsyncHandler } from "../../../../../../../router/api/v2/routeBuilder/core/util/createAsyncHandler";

jest.mock("../../../../../../../router/api/v2/routeBuilder/core/util/createAsyncHandler");

describe('validate() test suite', () => {
    const schema = Joi.object({
        username: Joi.string(),
        password: Joi.string()
    });
    const reqMock = {
        body: profile1
    };
    const resMock = {};
    const nextMock = jest.fn();

    it('Should throw SERVER_MISCONFIGURED APIError if the provided schema param is not Joi schema', async () => {
        createAsyncHandler.mockImplementation((fn) => { 
            return () => {
                return fn(reqMock, resMock, nextMock);
            }; 
        });
    
        const validationHandler = validate({name: 'not_schema'});
        async function callValidationHandler() {
            try {
                return await validationHandler();
            } catch (error) {
                return error;
            }
        }
        
        const resp = await callValidationHandler();
        expect(resp).toEqual(expect.objectContaining(serverMisconfiguredAPIError));
    });

    it('Should throw MultipleError for the validation errors found containing found validation errors', async () => {
        createAsyncHandler.mockImplementation((fn) => { 
            return () => {
                return fn({...reqMock, body: {username: 23}}, resMock, nextMock);
            }; 
        });
    
        const validationHandler = validate(schema);
        async function callValidationHandler() {
            try {
                return await validationHandler();
            } catch (error) {
                return error;
            }
        }
        
        const resp = await callValidationHandler();
        expect(resp).toEqual(expect.objectContaining(apiMultipleError));
    });

    it('Should not throw any errors and call next() if no validation errors found', async () => {
        createAsyncHandler.mockImplementation((fn) => { 
            return () => {
                return fn(reqMock, resMock, nextMock);
            }; 
        });
    
        const validationHandler = validate(schema);
        async function callValidationHandler() {
            try {
                return await validationHandler();
            } catch (error) {
                return error;
            }
        }
        
        const resp = await callValidationHandler();
        expect(resp).not.toEqual(expect.objectContaining(apiMultipleError));
        expect(resp).not.toEqual(expect.objectContaining(serverMisconfiguredAPIError));

        expect(nextMock).toHaveBeenCalledTimes(1);
    });
});