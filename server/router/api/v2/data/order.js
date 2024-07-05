import express from "express";
import OrderDataService from "../../../../service/OrderDataService.js";
import { Method } from "../routeBuilder/core/enums/Method.js";
import { RouteBuilder } from "../routeBuilder/RouteBuilder.js";
import { OrderCreateReq } from "../routeBuilder/rules/serialization/order.js";
import { orderCreate } from "../routeBuilder/rules/validation/order.js";
import isRespServiceError from "../routeBuilder/core/service/validateInput.js";
import { config } from "../routeBuilder/core/config.js";
import ClientService from "../../../../service/ClientService.js";
import { APIError } from "../routeBuilder/core/error/APIError.js";
import throwAPIError from "../routeBuilder/core/error/throwAPIError.js";
import { ErrorLocation } from "../routeBuilder/core/error/ErrorLocation.js";
import { ErrorReason } from "../routeBuilder/core/error/ErrorReason.js";

const router = express.Router();

const orderDataDAO = new OrderDataService();
const clientService = new ClientService();


new RouteBuilder('/', Method.POST)
    .serializeReq(OrderCreateReq)
    .authenticate()
    .validate(orderCreate)
    .addController(createOrder).attachToRouter(router);
async function createOrder(req, res) {
    const { senderId, recipientId } = req.body;
    const user = req[config.authFieldName];

    const sender = await clientService.readOneByIdAndProfileId(senderId, user.id);
    if(!sender)
        throw new APIError({
            reason: ErrorReason.NOT_FOUND, message: 'Could not find the sender',
            field: 'senderId', location: ErrorLocation.BODY
        });
    if(isRespServiceError(sender))
        return throwAPIError(sender);

    const recipient = await clientService.readOneByIdAndProfileId(recipientId, user.id);
    if(!recipient)
        throw new APIError({
            reason: ErrorReason.NOT_FOUND, message: 'Could not find the recipient',
            field: 'recipientId', location: ErrorLocation.BODY
        });
    if(isRespServiceError(recipient))
        return throwAPIError(sender);

    const order = await orderDataDAO.create({...req.body, profileId: user.id});
    if(isRespServiceError(order))
        return throwAPIError(order, null, ErrorLocation.BODY);

    if(!order)
        throw new APIError({
            reason: ErrorReason.UNEXPECTED, message: 'Could not create an order'
        });

    return order;
}

new RouteBuilder('/', Method.GET)
    .authenticate()
    .addController(getAll).attachToRouter(router);
async function getAll(req, res) {
    const user = req[config.authFieldName];
    
    const orders = await orderDataDAO.readAllByProfileId(user.id);
    if(!orders || orders?.length === 0)
        throw new APIError({
            reason: ErrorReason.NOT_FOUND, 
            message: 'Could not find any orders'
        });
    if(isRespServiceError(orders))
        return throwAPIError(orders);

    return orders;
}

new RouteBuilder('/:id', Method.GET)
    .authenticate()
    .addController(getOne).attachToRouter(router);
async function getOne(req, res) {
    const user = req[config.authFieldName];
    
    const orders = await orderDataDAO.readAllByProfileId(user.id);
    if(!orders)
        throw new APIError({
            reason: ErrorReason.NOT_FOUND, 
            message: 'Could not find any orders'
        });
    if(isRespServiceError(orders))
        return throwAPIError(orders);

    return orders;
}



export default router;