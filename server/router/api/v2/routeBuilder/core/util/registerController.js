import { config } from "../config.js";

export async function registerController(res, next, controllerFn, options={}) {
    res[options.respFieldName ?? config.respFieldName] = await controllerFn();
    return next();
}