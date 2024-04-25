import express from "express";
import {ClientReq, ClientRes} from "./serialization/client.js";
import {clientCreate} from "./validation/client.js";
import {APIError} from "../../../../util/error/APIError.js";
import {ErrorReason} from "../../../../util/error/ErrorReason.js";
import {RouteBuilder} from "./util/pipeline/RouteBuilder.js";
import {Method} from "./util/pipeline/Method.js";

const router = express.Router();

new RouteBuilder('/', Method.POST)
    .authenticate()
    .serializeReq(ClientReq).serializeRes(ClientRes)
    .validate(clientCreate)
    .addController(clientController).attachToRouter(router);

async function clientController(req, res) {
    if(req.body['lol'])
        throw new APIError(ErrorReason.NOT_FOUND, 'upsis, just testing', req.baseUrl, 'lol');

    const {authFieldName} = req;

    return { message: 'Client successfully processed', loggedUser: req[authFieldName] };
}



//router.post('/', serializeReq(ClientReq), validate(client), addController(clientController), serializeRes(ClientRes));

export default router;