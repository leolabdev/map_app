import {createAsyncHandler} from "../util/createAsyncHandler.js";

/**
 *
 * @param {ObjectSchema<any>} schema to be validated against
 */
const validate = (schema) => {
    return createAsyncHandler(async function (req, res, next) {
        try {
            await schema.validateAsync(req.body);
            next();
        } catch (error) {
            error.status = 400;
            throw error;
        }
    })
}

export default validate;