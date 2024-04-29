import {serializeReq} from "./core/pipelineHandlers/serializeReq.js";
import validate from "./core/pipelineHandlers/validate.js";
import {addController} from "./core/pipelineHandlers/addController.js";
import {serializeRes} from "./core/pipelineHandlers/serializeRes.js";
import {Router} from "express";
import {APIError} from "./core/error/APIError.js";
import {ErrorReason} from "./core/error/ErrorReason.js";
import {Method} from "./core/enums/Method.js";
import {authenticate} from "./core/pipelineHandlers/authenticate.js";
import {authorize} from "./core/pipelineHandlers/authorize.js";
import isAllowed from "./core/authorization/isAllowed.js";
import {Action} from "./core/enums/Action.js";
import {catchErrors} from "./core/pipelineHandlers/catchErrors.js";
import {formatResponse} from "./core/pipelineHandlers/formatResponse.js";
import {config} from "./core/config.js";
import {ErrorName} from "./core/error/ErrorName.js";


export class RouteBuilder {
    /**
     *
     * @param {string} endpoint endpoint of the route
     * @param {Method} method one of 4 http method to use in router
     * @param {{respFieldName: string, respErrorFieldName: string, authFieldName: string}} options
     */
    constructor(endpoint='/', method= Method.GET, options= config) {
        this.endpoint = endpoint;
        this.method = method;

        this.authenticator = null;
        this.authorizer = null;

        this.reqSerializer = null;
        this.reqValidator = null;
        this.controller = null;
        this.resSerializer = null;

        this.options = {...config, ...options};
    }
    #successStatusCode = null;

    authenticate = function (){
        this.authenticator = authenticate(this.options.authFieldName);
        return this;
    }

    authorize = function (resource, action=null){
        this.authenticator = authenticate(this.options.authFieldName);
        const actionToAuthorize = action ?? determineAction(this.method);
        this.authorizer = authorize(this.options.authFieldName, actionToAuthorize, resource, isAllowed);
        return this;
    }

    /**
     *
     * @param{Record<string, boolean>} shapeObject object in {field: isExposed} form with fields to be sanitized against
     */
    serializeReq = function (shapeObject){
        this.reqSerializer = serializeReq(this.options.respFieldName, shapeObject);
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
        this.controller = addController(this.options.respFieldName, controllerFn);
        return this;
    }

    /**
     *
     * @param {200 | 201 | 204} status
     * @returns {RouteBuilder}
     */
    successStatus = function (status){
        this.#successStatusCode = status;
        return this;
    }

    /**
     *
     * @param{Record<string, boolean>} shapeObject object in {field: isExposed} form with fields to be exposed
     */
    serializeRes = function (shapeObject){
        this.resSerializer = serializeRes(this.options.respFieldName, shapeObject);
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
            throw new APIError({
                name: ErrorName.SERVER_ERROR,
                reason: ErrorReason.SERVER_MISCONFIGURED,
                message: `problems with creating a route for ${this.endpoint} endpoint`
            });
        }

        return this.#addPipeConfigToRouter(router);
    }

    #addPipeConfigToRouter = function (router){
        const pipeHandlersToApply = [
            this.authenticator, this.authorizer,
            this.reqSerializer, this.reqValidator,
            this.controller,
            this.resSerializer,
            catchErrors(this.options.respErrorFieldName),
            formatResponse(this.options.respFieldName, this.options.respErrorFieldName, this.#successStatusCode)
        ];

        for(let i=0, len=pipeHandlersToApply.length; i<len; i++)
            pipeHandlersToApply[i] = pipeHandlersToApply[i] ?? this.#pipeHandlerMocker;

        return router[this.method](this.endpoint, ...pipeHandlersToApply);
    }
    #pipeHandlerMocker = function (req, res, next) { return next(); }
}

/**
 *
 * @param {Method} httpMethod
 * @returns {Action}
 */
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