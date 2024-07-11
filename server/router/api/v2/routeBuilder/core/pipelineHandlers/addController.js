import {createAsyncHandler} from "../util/createAsyncHandler.js";
import { registerController } from "../util/registerController.js";

/**
 *
 * @param {string} respFieldName
 * @param {(req: Request, res: Response) => Promise<any>} controllerFn function, which gets req and res objects
 * and returns the result of the request. If there is an error, it throws it
 * @returns {function(*, *, *): Promise<Awaited<*>>}
 */
export function addController(respFieldName, controllerFn) {
    return createAsyncHandler(async function(req, res, next) {
        registerController(res, next, async () => {
            return controllerFn(req, res);
        }, {respFieldName});
    });
}