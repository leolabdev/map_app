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


const orderDataDAO = new OrderDataService();
const optimizationUtil = new OptimizationUtil();
/**
 * orderIds ids of the orders
 * start car start point, where car is at the start of the travel, not required (if no start provided, random shipment address will be the start point)
 * end car end point, where car should end the travel, not required (if no end provided, end will be the last address of the built travel)
 * fuelusage fuel usage of the car per 100 km, not required
 * {
 *     orderIds: [1,2], (int)
 *     startOrderId :  1, orderId *optional
 *     endOrderId : 2, orderId *optional
 *     fuelusage: 5.7, *optional
 *     isCenterAvoided: true, *optional
 *     isTrafficSituation: true *optional
 *  }
 */
router.post('/orders', async (req, res) => {
    try{
        const {
            orderIds, startOrderId, endOrderId,
            avoidCityCenters, cityCentersToAvoid, isTrafficSituation,
            fuelusage
        } = req.body;
        const queriedOrders = await orderDataDAO.readByIds(orderIds);

        let startAddress, endAddress;
        if(startOrderId)
            startAddress = await orderDataDAO.read(startOrderId);
        if(endOrderId)
            endAddress = await orderDataDAO.read(endOrderId);

        const {lon: startLon, lat: startLat} = startAddress?.shipmentAddress?.dataValues;
        const {lon: endLon, lat: endLat} = endAddress?.deliveryAddress?.dataValues;

        const startCoord = startLon && startLat ? [startLon, startLat] : null;
        const endCoord = endLon && endLat ? [endLon, endLat] : null;

        //optimize the route via vroom
        const ordersBody = optimizationUtil.getShipmentDeliveryRequestBody(queriedOrders, startCoord, endCoord);
        if(!ordersBody)
            return res.status(500).send({error: 'Could not organize orders', status: 500});

        const key = process.env.ORS_API_KEY;
        const optimizationUrl = 'https://api.openrouteservice.org/optimization';

        const optimizationResp = await orsRequest(optimizationUrl, key, ordersBody);

        if(optimizationResp?.routes[0]?.steps?.length === 0)
            return res.status(500).send({error: 'Could not optimize the route', status: 500});
        const coordinates = optimizationResp.routes[0].steps.map(step => step.location);

        const url = `https://api.openrouteservice.org/v2/directions/driving-car/geojson`;
        const routingBody = { coordinates, instructions: false };
        let avoidMultiPolygon = await determineAvoidPolygon(avoidCityCenters, cityCentersToAvoid, isTrafficSituation);
        if(avoidMultiPolygon)
            routingBody.options = {avoid_polygons: avoidMultiPolygon};

        await orsRequestResponse(url, key, routingBody, res);
    } catch (err){
        console.log(err);
        return res.status(500).send({error: 'Failed to fetch routing data'});
    }
});


function sendServiceResp(serviceResp, res){
    if(isRespServiceError(serviceResp)){
        const apiError = convertServiceToAPIError(serviceResp);
        return res.status(apiError.status).send({[config.respErrorFieldName]: [apiError]});
    }
    
    res.send({[config.respFieldName]: serviceResp});
}

export default router;