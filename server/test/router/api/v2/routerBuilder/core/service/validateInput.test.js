import Joi from "joi";
import { validateInput } from "../../../../../../../router/api/v2/routeBuilder/core/service/validateInput";
import { notNumberError, requiredError } from "../../../../../../test_utils/data/serviceErrors";
import { ServiceError } from "../../../../../../../router/api/v2/routeBuilder/core/service/dataExtractors/error/ServiceError";

describe('validateInput() test suite', () => {
    function myFunc(input) {
        return null;
    }

    const validationSchema = {
        schema: Joi.object({
            username: Joi.string().required(),
            age: Joi.number()
        })
    };

    const handler = validateInput(myFunc, validationSchema);

    it('Should array of ServiceError objects for found request validation errors', async () => {
        const invalidInput = {
            username: undefined,
            age: 'not_num'
        }

        const returnedErrors = await handler(invalidInput);

        expect(returnedErrors).toEqual(expect.arrayContaining([
            expect.objectContaining(requiredError),
            expect.objectContaining(notNumberError)
        ]));
    });

    it('Should return REQUIRED ServiceError if the request param is not defined', async () => {
        const returnedErrors = await handler(null);

        expect(returnedErrors).toEqual(expect.objectContaining(requiredError));
    });

    it('Should not return any errors if the input is valid', async () => {
        const invalidInput = {
            username: 'some_user',
            age: 25
        }
        const resp = await handler(invalidInput);

        expect(resp).not.toBeInstanceOf(ServiceError);
        expect(resp).toBeNull();
    });
});