import { config } from "../config.js";

/**
 * Function will add controllerFn response to the res object and call express next(). 
 * This response then can be used by other RouteBuilder handlers.
 *
 * @param {*} res express response object
 * @param {*} next express next function
 * @param {*} controllerFn function to register, notice, that it must return some value
 * @param {{respFieldName?: string}=} options additional settings
 * @returns 
 */
export async function registerController(res, next, controllerFn, options={}) {
    const [isError, resp] = await controllerFn().then((result) => {
        return [false, result];
    }).catch((err) => {
        return [true, err];
    });

    if(isError)
        return next(resp);

    res[options.respFieldName ?? config.respFieldName] = resp;
    return next();
}