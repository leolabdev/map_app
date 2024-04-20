import {serializeReq} from "./serializeReq.js";
import validate from "./validate.js";
import {addController} from "./addController.js";
import {serializeRes} from "./serializeRes.js";
import {Router} from "express";
import {APIError} from "../../../../../../util/error/APIError.js";
import {ErrorReason} from "../../../../../../util/error/ErrorReason.js";

export class RouteBuilder {
    /**
     *
     * @param {string} endpoint endpoint of the route
     * @param {'post' | 'get' | 'put' | 'delete'} method one of 4 http method to use in router
     */
    constructor(endpoint='/', method='get') {
        this.endpoint = endpoint;
        this.method = method;

        this.reqSerializer = null;
        this.reqValidator = null;
        this.controller = null;
        this.resSerializer = null;
    }

    /**
     *
     * @param{Record<string, boolean>} shapeObject object in {field: isExposed} form with fields to be sanitized against
     */
    serializeReq = function (shapeObject){
        this.reqSerializer = serializeReq(shapeObject);
        return this;
    }

    /**
     *
     * @param {ObjectSchema<any>} schema to be validated against
     */
    validate = function (schema){
        this.reqValidator = validate(schema);
        return this;
    }

    /**
     *
     * @param {(req: Request, res: Response) => Promise<any>} controllerFn function, which gets req and res objects
     * and returns the result of the request. If there is an error, it throws it
     */
    addController = function (controllerFn){
        this.controller = addController(controllerFn);
        return this;
    }

    /**
     *
     * @param{Record<string, boolean>} shapeObject object in {field: isExposed} form with fields to be exposed
     */
    serializeRes = function (shapeObject){
        this.resSerializer = serializeRes(shapeObject);
        return this;
    }

    /**
     * Get the configured router object
     * @param{Router} router attach the specified route to Express router
     * @returns {Router} modified Express router with the specified route params
     */
    attachToRouter = function (router) {
        if(!['post', 'get', 'put', 'delete'].includes(this.method) || !this.controller){
            console.error(`The route can not be created, because the method or controller function are not defined or have wrong types. ` +
             `Endpoint ${this.endpoint}, method: ${this.method}`);
            throw new APIError(ErrorReason.UNEXPEXTED, `problems with creating a route for ${this.endpoint} endpoint`);
        }

        return this.#addPipeConfigToRouter(router);
    }

    #addPipeConfigToRouter = function (router){
        let pipeHandlersToApply = [this.reqSerializer, this.reqValidator, this.controller, this.resSerializer];
        for(let i=0, len=pipeHandlersToApply.length; i<len; i++)
            pipeHandlersToApply[i] = pipeHandlersToApply[i] ?? this.#pipeHandlerMocker;

        return router[this.method](this.endpoint, ...pipeHandlersToApply);
    }
    #pipeHandlerMocker = function (req, res, next) { return next(); }
}