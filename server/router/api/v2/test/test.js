import express from "express";
import {ClientReq, ClientRes} from "./routeBuilder/rules/serialization/client.js";
import {clientCreate} from "./routeBuilder/rules/validation/client.js";
import {APIError} from "./routeBuilder/core/error/APIError.js";
import {ErrorReason} from "./routeBuilder/core/error/ErrorReason.js";
import {RouteBuilder} from "./routeBuilder/RouteBuilder.js";
import {Method} from "./routeBuilder/core/enums/Method.js";
import {Resource} from "./routeBuilder/rules/authorization/Resource.js";
import {ErrorLocation} from "./routeBuilder/core/error/ErrorLocation.js";

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



//router.post('/', serializeReq(ClientReq), validate(client), addController(clientController), serializeRes(ClientRes));

export default router;