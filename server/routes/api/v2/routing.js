import APIRequestUtil from "../../../util/APIRequestUtil.js";
import ValuesDateChecker from "../../../util/ValuesDateChecker.js";
import DataDAO from "../../../DAO/DataDAO.js";
import OrderDataDAO from "../../../DAO/OrderDataDAO.js";
import OptimizationUtil from "../../../util/OptimizationUtil.js";
import AddressUtil from "../../../util/AddressUtil.js";
import DaoUtil from "../../../util/DaoUtil.js";
import Util from "../../../util/Util.js";
import PolygonUtil from "../../../util/PolygonUtil.js";
import express from "express";
import axios from "axios";
import CityCenterUtil from "../../../util/CityCenterUtil.js";

const router = express.Router();

const apiRequestUtil = new APIRequestUtil();
const valuesDateChecker = new ValuesDateChecker();
const dataDAO = new DataDAO();
const orderDataDAO = new OrderDataDAO();
const optimizationUtil = new OptimizationUtil();
const addressUtil = new AddressUtil();
const daoUtil = new DaoUtil();
const util = new Util();
const polygonUtil = new PolygonUtil();
const host = process.env.API_HOST || "localhost";
const port = process.env.API_PORT || 8081;

/**
 * Sends api query to openrouteservice to calculate route. Uses openrouteservices directions service.
 * Fuelusage default is 8.9
 *
 * Post body 3 point routing example:
 * {
 *      "coordinates":[
 *          [24.936707651023134,60.18226502577591],
 *          [24.936707651023134,60.18226502577591],
 *          [24.573798698987527,60.19074881467758]
 *      ]
 *  }
 * Post body 2 point routing example and avarege fuel useage of vehicle (L/100Km):
 * {
 *      "coordinates":[
 *          [24.936707651023134,60.18226502577591],
 *          [24.573798698987527,60.19074881467758]
 *      ],
 *      "fuelusage": 8.9
 *  }
 *
 * responses back geoJSON
 */
router.post('/', async (req, res, next) => {
    const {coordinates, fuelusage, startCoordinateIndex, endCoordinateIndex, avoidCityCenters, cityCentersToAvoid} = req.body;
    if(!coordinates)
        res.status(400).send({error: "coordinates field is required", status: 400});

    const key = process.env.ORS_API_KEY;
    const url = `https://api.openrouteservice.org/v2/directions/driving-car/geojson`;

    let avoidedCenters = [];
    if(avoidCityCenters)
        avoidedCenters = await CityCenterUtil.getAllCityCentersArr();
    else if(cityCentersToAvoid && cityCentersToAvoid.length > 0)
        avoidedCenters = await CityCenterUtil.getCityCentersByNames(cityCentersToAvoid);

    const optimizedCoords = await optimizeRoute(coordinates, key, {
        startIndex: startCoordinateIndex,
        endIndex: endCoordinateIndex,
        polygonsToAvoid: avoidedCenters
    });

    if(!optimizedCoords)
        return res.status(500).send({error: "could not optimize the route", status: 500});

    await orsRequestResponse(url, key, {coordinates: optimizedCoords}, res);
});


/**
 * orderIds ids of the orders
 * start car start point, where car is at the start of the travel, not required (if no start provided, random shipment address will be the start point)
 * end car end point, where car should end the travel, not required (if no end provided, end will be the last address of the built travel)
 * fuelusage fuel usage of the car per 100 km, not required
 * {
 *     orderIds: [1,2], (int)
 *     start : [24.573798698987527,60.19074881467758] or 1, (lon, lat) or orderId *optional
 *     end : [24.573798698987527,60.19074881467758] or 2, (lon, lat) or orderId *optional
 *     fuelusage: 5.7, *optional
 *     isCenterAvoided: true, *optional
 *     isTrafficSituation: true *optional
 *  }
 */
router.post('/orders', async (req, res) => {
    try{
        const orderIds = req.body.orderIds;
        const isCenterAvoided = req.body.isCenterAvoided;
        const isTrafficSituation = req.body.isTrafficSituation;
        const start = req.body.start;
        const end = req.body.end;
        const queriedOrders = await orderDataDAO.readByIds(orderIds);

        //generate start and end points information for the client side
        let respStart, respEnd, startReq, endReq;
        if(start != null) {
            respStart = await getPointData(start);
            startReq = getPointCoordinates(respStart, 1);
        }
        if(end != null){
            respEnd = await getPointData(end);
            endReq = getPointCoordinates(respEnd, 2);
        }

        //optimize the route via vroom
        const optimizationResp = await getOptimizedShipmentDelivery(queriedOrders, startReq, endReq);
        const coordinates = optimizationUtil.getOptimizedCoordinates(optimizationResp);

        //if needed, add areas to be avoided
        const options = {};

        let polygonToAvoid;
        if(isCenterAvoided){
            polygonToAvoid = await getCitiesCentersPolygons(queriedOrders);
            polygonToAvoid = polygonUtil.getPolygonWithoutPointsInside(polygonToAvoid, coordinates);
        }

        if(isTrafficSituation){
            if(polygonToAvoid == null){
                polygonToAvoid = {type: "MultiPolygon", coordinates: []};
            }
            const trafficResp = await axios.get(`http://${host}:${port}/dao/area/SlowTraffic`);
            const slowTrafficAreaCoordinates = trafficResp.data.result.coordinates;
            if(slowTrafficAreaCoordinates.length > 0){
                polygonToAvoid.coordinates.push(...slowTrafficAreaCoordinates);
            }
        }

        if(polygonToAvoid != null && polygonToAvoid.coordinates.length > 0){
            options.avoid_polygons = polygonToAvoid;
        }

        makeRoutingRequest(coordinates, options, req, res, { orders: queriedOrders, start: respStart, end: respEnd });
    }catch (err){
        console.log(err);
    }
});

async function orsRequestResponse(url, token, body, res) {
    const resp = await orsRequest(url, token, body);
    if(!resp)
        return res.status(500).send({error: 'Failed to fetch routing data'});

    res.status(200).send(resp);
}

async function orsRequest(url, token, body) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json; charset=utf-8',
                'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8'
            },
            body: JSON.stringify(body)
        });
        if (!response.ok)
            throw new Error(`Request failed with status: ${response.status}`);

        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

function isIndexValid(index, array) {
    return index !== undefined && index !== null && (index < array.length) && (index >= 0);
}
async function optimizeRoute(coordinates, key, {startIndex, endIndex, estimatedStopTimeS=300, polygonsToAvoid=[]} = {}) {
    if(!coordinates || coordinates.length === 0 || !key){
        console.error('No coordinates or key provided');
        return null;
    }

    // Prepare the jobs array from coordinates
    const jobs = coordinates.map((coord, index) => ({
        id: index + 1,
        service: estimatedStopTimeS, //default service time
        location: coord
    }));

    const start = isIndexValid(startIndex, coordinates) ? coordinates[startIndex] : coordinates[0];
    const end = isIndexValid(endIndex, coordinates) ? coordinates[endIndex] : coordinates[coordinates.length-1];

    const vehicles = [ { id: 1, profile: 'driving-car', start, end } ]
    const options = {};
    if(polygonsToAvoid && polygonsToAvoid.length > 0)
        options.avoid_polygons = polygonsToAvoid;

    // The request payload
    const body = { jobs, vehicles, options };
    const optimizationResp = await orsRequest('https://api.openrouteservice.org/optimization', key, body);
    if(!optimizationResp || !optimizationResp.routes)
        return null;

    // Extract the ordered coordinates from the response
    return optimizationResp.routes.map(route =>
        route.steps.filter(step => step.type === 'job').map(step => step.location)
    ).flat();
}

export default router;