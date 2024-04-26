import {serializeReq} from "./core/pipelineHandlers/serializeReq.js";
import validate from "./core/pipelineHandlers/validate.js";
import {addController} from "./core/pipelineHandlers/addController.js";
import {serializeRes} from "./core/pipelineHandlers/serializeRes.js";
import {Router} from "express";
import {APIError} from "./error/APIError.js";
import {ErrorReason} from "./error/ErrorReason.js";
import {Method} from "./core/enums/Method.js";
import {authenticate} from "./core/pipelineHandlers/authenticate.js";
import {authorize} from "./core/pipelineHandlers/authorize.js";
import isAllowed from "./core/authorization/isAllowed.js";
import {Action} from "./core/enums/Action.js";

export class RouteBuilder {
    /**
     *
     * @param {string} endpoint endpoint of the route
     * @param {Method} method one of 4 http method to use in router
     */
    constructor(endpoint='/', method= Method.GET) {
        this.endpoint = endpoint;
        this.method = method;

        this.authenticator = null;
        this.authorizer = null;

        this.reqSerializer = null;
        this.reqValidator = null;
        this.controller = null;
        this.resSerializer = null;
    }


    authenticate = function (){
        this.authenticator = authenticate;
        return this;
    }

    authorize = function (resource, action=null){
        this.authenticator = authenticate;
        const actionToAuthorize = action ?? determineAction(this.method);
        this.authorizer = authorize(actionToAuthorize, resource, isAllowed);
        return this;
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
        let pipeHandlersToApply = [this.authenticator, this.authorizer, this.reqSerializer, this.reqValidator, this.controller, this.resSerializer];
        for(let i=0, len=pipeHandlersToApply.length; i<len; i++)
            pipeHandlersToApply[i] = pipeHandlersToApply[i] ?? this.#pipeHandlerMocker;

        return router[this.method](this.endpoint, ...pipeHandlersToApply);
    }
    #pipeHandlerMocker = function (req, res, next) { return next(); }
}

function determineAction(httpMethod) {
    switch(httpMethod){
        case Method.POST:
            return Action.CREATE;
        case Method.GET:
            return Action.READ;
        case Method.PUT:
            return Action.UPDATE;
        case Method.DELETE:
            return Action.DELETE;
    }
}