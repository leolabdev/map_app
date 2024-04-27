import express from "express";
import {ClientReq, ClientRes} from "./routeBuilder/rules/serialization/client.js";
import {clientCreate} from "./routeBuilder/rules/validation/client.js";
import {APIError} from "./routeBuilder/core/error/APIError.js";
import {ErrorReason} from "./routeBuilder/core/error/ErrorReason.js";
import {RouteBuilder} from "./routeBuilder/RouteBuilder.js";
import {Method} from "./routeBuilder/core/enums/Method.js";
import {Resource} from "./routeBuilder/rules/authorization/Resource.js";

const router = express.Router();

new RouteBuilder('/', Method.POST, {respFieldName: 'tiedot', respErrorFieldName: 'virheet'})
    .authorize(Resource.TEST)
    .serializeReq(ClientReq).serializeRes(ClientRes)
    .validate(clientCreate)
    .addController(clientController).attachToRouter(router);

async function clientController(req, res) {
    if(req.body['lol'])
        throw new APIError(ErrorReason.NOT_FOUND, 'upsis, just testing', req.baseUrl, 'lol');

    return { message: 'Client successfully processed' };
}



//router.post('/', serializeReq(ClientReq), validate(client), addController(clientController), serializeRes(ClientRes));

export default router;