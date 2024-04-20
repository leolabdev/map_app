import express from "express";
import {ClientReq, ClientRes} from "./serialization/client.js";
import {clientCreate} from "./validation/client.js";
import {APIError} from "../../../../util/error/APIError.js";
import {ErrorReason} from "../../../../util/error/ErrorReason.js";
import {RouteBuilder} from "./util/pipeline/RouteBuilder.js";

const router = express.Router();

// Asynchronous controller
const clientController = async (req, res) => {
    if(req.body['lol'])
        throw new APIError(ErrorReason.NOT_FOUND, 'upsis, just testing', req.baseUrl, "lol");

    return { message: "Client successfully processed" };
};
new RouteBuilder('/', 'post')
    .serializeReq(ClientReq).serializeRes(ClientRes)
    .validate(clientCreate)
    .addController(clientController).attachToRouter(router);


//router.post('/', serializeReq(ClientReq), validate(client), addController(clientController), serializeRes(ClientRes));

export default router;