import express from "express";
import validate from "./validation/validate.js";
import {ClientReq, ClientRes} from "./serialization/dto/client.js";
import {client} from "./validation/schema/client.js";
import {serializeReq} from "./serialization/serializeReq.js";
import {serializeRes} from "./serialization/serializeRes.js";
import {addController} from "./util/addController.js";
import {APIError} from "../../../../util/error/APIError.js";
import {ErrorReason} from "../../../../util/error/ErrorReason.js";

const asyncHandler = fn => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// Asynchronous controller
const clientController = async (req, res) => {
    if(req.body['lol'])
        throw new APIError(ErrorReason.NOT_FOUND, 'upsis, just testing', req.baseUrl, "lol");

    return { message: "Client successfully processed" };
};

const router = express.Router();
router.post('/', serializeReq(ClientReq), validate(client), addController(clientController), serializeRes(ClientRes));
export default router;