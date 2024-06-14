import express from "express";
import {ClientReq, ClientRes} from "./routeBuilder/rules/serialization/client.js";
import {clientCreate} from "./routeBuilder/rules/validation/client.js";
import {APIError} from "./routeBuilder/core/error/APIError.js";
import {ErrorReason} from "./routeBuilder/core/error/ErrorReason.js";
import {RouteBuilder} from "./routeBuilder/RouteBuilder.js";
import {Method} from "./routeBuilder/core/enums/Method.js";
import {Resource} from "./routeBuilder/rules/authorization/Resource.js";
import {ErrorLocation} from "./routeBuilder/core/error/ErrorLocation.js";
import AddressService from "../../../../service/AddressService.js";
import isRespServiceError from "./routeBuilder/core/service/validateInput.js";
import throwAPIError from "./routeBuilder/core/error/throwAPIError.js";
import ClientService from "../../../../service/ClientService.js";

const router = express.Router();

new RouteBuilder('/', Method.POST, {respFieldName: 'tiedot', respErrorFieldName: 'virheet'})
    .authorize(Resource.TEST)
    .successStatus(200)
    .serializeReq(ClientReq).serializeRes(ClientRes)
    .validate(clientCreate)
    .addController(clientController).attachToRouter(router);
async function clientController(req, res) {
    if(req.body['lol'])
        throw new APIError({
            reason: ErrorReason.NOT_FOUND,
            message: 'upsis, just testing',
            endpoint: req.baseUrl,
            field: 'lol',
            location: ErrorLocation.BODY
        });

    return { message: 'Client successfully processed' };
}

new RouteBuilder('/', Method.GET)
    .authorize(Resource.TEST).addController(testRead).successStatus(201).attachToRouter(router);
async function testRead(req, res) {
    return true;
}

const service = new AddressService();

new RouteBuilder('/test/:id', Method.POST).addController(t).attachToRouter(router);

async function t(req, res) {
    const resp = await service.delete(req.params.id);
    if(isRespServiceError(resp))
        return throwAPIError(resp, null, ErrorLocation.PARAM);

    return resp;
}

export default router;