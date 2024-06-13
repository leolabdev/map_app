import {createAsyncHandler} from "../util/createAsyncHandler.js";

/**
 *
 * @param {string} respFieldName
 * @param {(req: Request, res: Response) => Promise<any>} controllerFn function, which gets req and res objects
 * and returns the result of the request. If there is an error, it throws it
 * @returns {function(*, *, *): Promise<Awaited<*>>}
 */
export function addController(respFieldName, controllerFn) {
    return createAsyncHandler(async function(req, res, next) {
        res[respFieldName] = await controllerFn(req, res);
        return next();
    });
}