import express from "express";
import RoutingService from "../../../../service/RoutingService.js";
import { routingQueue } from "../../../../util/throttlingQueue.js";
import { catchErrors } from "../routeBuilder/core/pipelineHandlers/catchErrors.js";
import { formatResponse } from "../routeBuilder/core/pipelineHandlers/formatResponse.js";
import { registerController } from "../routeBuilder/core/util/registerController.js";
import { serializeReq } from "../routeBuilder/core/pipelineHandlers/serializeReq.js";
import { config } from "../routeBuilder/core/config.js";
import { RoutingOrders, RoutingRoute } from "../routeBuilder/rules/serialization/routing.js";
import validate from "../routeBuilder/core/pipelineHandlers/validate.js";
import { routingCoordinates, routingOrders } from "../routeBuilder/rules/validation/routing.js";
import { determineResError } from "../routeBuilder/core/pipelineHandlers/determineResError.js";
import { authenticate } from "../routeBuilder/core/pipelineHandlers/authenticate.js";
import OrderDataService from "../../../../service/OrderDataService.js";
import isServiceError from "../routeBuilder/core/service/dataExtractors/error/isServiceError.js";
import { APIError } from "../routeBuilder/core/error/APIError.js";
import { ErrorReason } from "../routeBuilder/core/error/ErrorReason.js";
import { ErrorLocation } from "../routeBuilder/core/error/ErrorLocation.js";

const router = express.Router();

const routingService = new RoutingService();
const orderService = new OrderDataService();

router.post('/', serializeReq(config.respFieldName, RoutingRoute), validate(routingCoordinates), async (req, res, next) => {
    const reqFn = async function(){
        registerController(res, next, async () => {
            return await routingService.findRouteByCoordinates(req.body);
        });
    }
    routingQueue.addRequest(reqFn);
}, determineResError(), catchErrors(), formatResponse());

router.post('/orders', authenticate(), serializeReq(config.respFieldName, RoutingOrders), validate(routingOrders), async (req, res, next) => {
    const reqFn = async function(){
        registerController(res, next, async () => {
            const { user } = req;
            const orderIds = await orderService.readOrderIdsByProfileIdAndIds(user.id, req.body.orderIds);

            if(!orderIds || (Array.isArray(orderIds) && orderIds.length === 0))
                return new APIError({
                    reason: ErrorReason.NOT_FOUND, 
                    message: 'Could not find provided orders',
                     location: ErrorLocation.BODY
                });

            if(isServiceError(orderIds) || isServiceError(orderIds[0]))
                return orderIds;

            return routingService.findRouteByOrderIds({...req.body, orderIds});
        });
    }
    routingQueue.addRequest(reqFn);
}, determineResError(), catchErrors(), formatResponse());

export default router;