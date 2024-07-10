import express from "express";
import CityCenterUtil from "../../../../util/CityCenterUtil.js";
import AreaService from "../../../../service/AreaService.js";
import OrderDataService from "../../../../service/OrderDataService.js";
import OptimizationUtil from "../../../../util/OptimizationUtil.js";
import RoutingService from "../../../../service/RoutingService.js";
import { routingQueue } from "../../../../util/throttlingQueue.js";
import isRespServiceError from "../routeBuilder/core/service/validateInput.js";
import { convertServiceToAPIError } from "../routeBuilder/core/error/convertServiceToAPIError.js";
import { config } from "../routeBuilder/core/config.js";

const router = express.Router();

const areaDAO = new AreaService();
const routingService = new RoutingService();

router.post('/', async (req, res, next) => {
    const reqFn = async function(){
        const resp = await routingService.findRouteByCoordinates(req.body);
        sendServiceResp(resp, res);
    }
    routingQueue.addRequest(reqFn);
});


const orderService = new OrderDataService();

router.post('/orders', async (req, res) => {
    const reqFn = async function(){
        const resp = await routingService.findRouteByOrderIds(req.body);
        sendServiceResp(resp, res);
    }
    routingQueue.addRequest(reqFn);
});


function sendServiceResp(serviceResp, res){
    if(Array.isArray(serviceResp) && isRespServiceError(serviceResp[0])){
        const errors = [];
        for(let i=0, l=serviceResp.length; i<l; i++)
            errors.push(convertServiceToAPIError(serviceResp[i]));

        return res.status(errors[0].status).send({[config.respErrorFieldName]: errors});
    }

    if(isRespServiceError(serviceResp)){
        const resp = convertServiceToAPIError(serviceResp);
        return res.status(resp.status).send({[config.respErrorFieldName]: [resp]});
    }
    
    res.send({[config.respFieldName]: serviceResp});
}

export default router;