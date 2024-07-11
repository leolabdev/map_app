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

const router = express.Router();

const routingService = new RoutingService();

router.post('/', serializeReq(config.respFieldName, RoutingRoute), validate(routingCoordinates), async (req, res, next) => {
    const reqFn = async function(){
        registerController(res, next, async () => {
            return await routingService.findRouteByCoordinates(req.body);
        });
    }
    routingQueue.addRequest(reqFn);
}, determineResError(), catchErrors(), formatResponse());

router.post('/orders', serializeReq(config.respFieldName, RoutingOrders), validate(routingOrders), async (req, res, next) => {
    const reqFn = async function(){
        registerController(res, next, async () => {
            return routingService.findRouteByOrderIds(req.body);
        });
    }
    routingQueue.addRequest(reqFn);
}, determineResError(), catchErrors(), formatResponse());

export default router;