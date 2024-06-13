import APIRequestUtil from "../../../util/APIRequestUtil.js";
import ValuesDateChecker from "../../../util/ValuesDateChecker.js";
import DataService from "../../../service/DataService.js";
import OrderDataService from "../../../service/OrderDataService.js";
import OptimizationUtil from "../../../util/OptimizationUtil.js";
import AddressUtil from "../../../util/AddressUtil.js";
import DaoUtil from "../../../util/DaoUtil.js";
import Util from "../../../util/Util.js";
import PolygonUtil from "../../../util/PolygonUtil.js";
import express from "express";
import * as https from "https";
import axios from "axios";

const router = express.Router();

const apiRequestUtil = new APIRequestUtil();
const valuesDateChecker = new ValuesDateChecker();
const dataDAO = new DataService();
const orderDataDAO = new OrderDataService();
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
router.post('/routing', async (req, res, next) => {
    try{
        let coordinates = req.body.coordinates;
        if(!coordinates){
            res.status(400).send({
                message: 'coordinates field is required',
                status: 400
            });
            return next();
        }

        const optimizationResp = await getOptimizedRoute(coordinates);
        coordinates = optimizationUtil.getOptimizedCoordinates(optimizationResp);
        await makeRoutingRequest(coordinates, undefined, req, res);
    }catch (err){
        console.log(err);
    }
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
router.post('/routing/orders', async (req, res) => {
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

/**
 * Calculates fuel consumption in route based on route length.
 * @param {number} length of route in (m)
 * @param {number} fuelUsage of vehicle (L/100Km)
 * @returns {number} fuel consumption in route
 */
function calcFuel(length, fuelUsage) {
    const lengthKmPerL = length / 1000 / 100;
    return lengthKmPerL * fuelUsage;
}
/**
 * Calculates your CO2 emission of route.
 *
 * Fuel combustion emissions can be calculated using the emissions factor of 2.33 kg CO2e/litre.
 * If your car average 8 L/100 km then you multiply this by 2.33 and divide by 100 to give 186 g CO2e/km
 * for combustion emissions.
 *
 * @param {number} length of route in (m)
 * @param {number} fuelUsage of vehicle (L/100Km)
 * @returns {number} C02 emission from route. eg. 4.1kg CO2e (unit is kg CO2e)
 */
function calcCO2(length, fuelUsage) {
    const CO2 = 2.33; // kg CO2e/litre
    // Convert m to km
    const lengthKm = length / 1000.0;
    return ((fuelUsage*CO2)/100)*lengthKm;
}

/**
 * Get fuel price by country.
 * return example:
 *  {
 *    currency: 'euro',
 *    lpg: '-',
 *    diesel: '2,260',
 *    gasoline: '2,156',
 *    country: 'Finland'
 *  }
 * @param {string} country
 * @returns {Promise<null | {
 *    currency: 'euro',
 *    lpg: '-',
 *    diesel: string,
 *    gasoline: string,
 *    country: string
   }>}
 */
async function fuelPriceJSON(country) {
    const data = await dataDAO.readAll();
    const areValuesOld = valuesDateChecker.areValuesOld(["diesel", "gasoline"], data);

    if(!areValuesOld){
        const result = data.reduce((acc, {name, value}) => ({...acc, [name]: value}), {});
        result.country = "Finland";
        result.currency = "euro";
        return result;
    }

    const options = apiRequestUtil.getFuelSettings();

    try {
        const response = await fetch(options.url, { method: options.method, headers: options.headers });
        if (!response.ok)
            return null;

        const jsonData = await response.json();

        for (let index in jsonData.results) {
            if (jsonData.results[index].country.toLowerCase() === country.toLowerCase()) {
                const {country, currency, ...fuelPrices} = jsonData.results[index];

                const fuelNames = Object.keys(fuelPrices);
                for (let i = 0; i < fuelNames.length; i++) {
                    await dataDAO.update({
                        "name": fuelNames[i],
                        "value": fuelPrices[fuelNames[i]]
                    });
                }
                return fuelPrices;
            }
        }
    } catch (error) {
        console.error("Error fetching fuel prices:", error);
        return null;
    }
}

/**
 * The method calculates price of the route(spent fuel price) for different fuels.
 * @param {Object.<string>} prices fuel prices object
 * @param {number} fuelSpent fuel spent amount
 * @returns {{diesel: string; gasoline: string} | null} object with route prices for different fuels
 */
function calcRoutePrice(prices, fuelSpent) {
    if(!prices)
        return null;

    const dieselPriceStr = prices.diesel.replace(",", ".");
    const dieselPrice = parseFloat(dieselPriceStr) * fuelSpent;

    const gasolinePriceStr = prices.gasoline.replace(",", ".");
    const gasolinePrice = parseFloat(gasolinePriceStr) * fuelSpent;

    return {
        diesel: dieselPrice.toFixed(2),
        gasoline: gasolinePrice.toFixed(2)
    };
}

/**
 * The method queries city centers areas from the Area and AreaCoordinate SQL tables based on addresses from order ORM objects.
 * @param {OrderData[]} orders array with order ORM objects.
 * @returns {Promise<{coordinates: number[], type: string}> | null} found city centers areas array
 */
async function getCitiesCentersPolygons(orders){
    const cities = Array.from(util.getOrdersCities(orders));
    if(!cities || cities.length === 0)
        return null;

    for (let city of cities) {
        try {
            const response = await fetch(`http://${host}:${port}/dao/area/${encodeURIComponent(city)}Center`);
            if (!response.ok)
                return null;

            const respPolygon = await response.json().then(data => data.result);
            if(!respPolygon)
                return null;

            const polygon = {type: "MultiPolygon", coordinates: []};
            if (respPolygon.type === "Polygon")
                polygon.coordinates.push(respPolygon.coordinates);
            else if (respPolygon.type === "MultiPolygon")
                polygon.coordinates.push(...respPolygon.coordinates);

            return polygon;
        } catch (error) {
            console.error("Error fetching city center polygon:", error);
            return null;
        }
    }
}

/**
 * The method put given coordinates to the optimized order(the shortest path) by making request to the VRoom project service.
 * Read more from Open Route Service documentation optimization section.
 * @param {Array.<Array.<number>>} coordinates array of coordinates in form [lon, lat]
 * @returns {Promise<unknown>} response from the VRoom project service
 */
async function getOptimizedRoute(coordinates) {
    try{
        return new Promise(async function (resolve, reject) {
            const reqBody = optimizationUtil.getVROOMRequestObject(coordinates);
            await makeOptimizationRequest(reqBody, resolve);
        });
    }catch (err){
        console.log(err);
        return null;
    }
}

/**
 * The method get shipment and delivery addresses from the given orders and put them to the optimized order(the shortest path) by making request to the VRoom project service.
 * Read more from Open Route Service documentation optimization section.
 * @param {Array.<Object>} orderArr array of the order ORM objects
 * @param {Array.<number>=} start start coordinate in the form [lon, lat], optional parameter
 * @param {Array.<number>=} end end coordinate in the form [lon, lat], optional parameter
 * @returns {Promise<unknown>} response from the VRoom project service
 */
async function getOptimizedShipmentDelivery(orderArr, start, end) {
    try{
        return new Promise(async function (resolve, reject) {
            const reqBody = optimizationUtil.getShipmentDeliveryRequestBody(orderArr, start, end);
            makeOptimizationRequest(reqBody, resolve);
        });
    }catch (err){
        console.log(err);
    }
}

/**
 * The method gets point address based on provided data.
 * @param {number|Array.<number>} pointReq order id or coordinate array in form [lon, lat]
 * @returns {Promise<null|Object|Object[]>} address data
 */
async function getPointData(pointReq) {
    if(typeof pointReq === "number"){
        //point is order id
        const result = await orderDataDAO.read(pointReq);
        return daoUtil.unpackOrder(result);
    } else if(Array.isArray(pointReq)){
        //point is [lon, lat] array (=coordinates)
        return await addressUtil.getAddressByCoordinates(pointReq);
    } else{
        return null;
    }
}

/**
 * The method gets points coordinates based on point data.
 * The point data may be address object with coordinates included or order ORM object.
 * @param {Object} pointData address object with coordinates field([lon, lat]) or order ORM object
 * @param {number} addressToGet 1 for shipment address and 2 for delivery address, if order ORM object provided
 * @returns {Array.<number>} coordinates array in form [lon, lat]
 */
function getPointCoordinates(pointData, addressToGet) {
    let result;
    if(pointData.type != null && pointData.type === "address"){
        result = pointData.coordinates;
    } else if(addressToGet === 1){
        const shipmentAddress = pointData.shipmentAddress;
        result = [shipmentAddress.lon, shipmentAddress.lat];
    } else if(addressToGet === 2){
        const deliveryAddress =  pointData.deliveryAddress;
        result = [deliveryAddress.lon, deliveryAddress.lat];
    }

    return result;
}

/**
 * The method makes request to the VRoom project service.
 * Read more from the Open Route Service API docs optimization section.
 * @param {Object} reqBody request body
 * @param {function} resolve
 * @returns {Promise<null>}
 */
async function makeOptimizationRequest(reqBody, resolve) {
    if(!reqBody)
        return null;

    let data = JSON.stringify(reqBody);
    const options = apiRequestUtil.getORSSettings('/optimization');

    options.headers["Content-Length"] = data.length;
    console.log(options);

    const request = await https.request(options, (response) => {
        let data = '';

        response.on('data', (chunk) => {
            data += chunk;
        });

        response.on('end', () => {
            let JsonData;
            try {
                JsonData = JSON.parse(data);
                resolve(JsonData);
            } catch (err) {
                console.log(err);
            }
        });

    }).on("error", (err) => {
        console.log("Error: ", err.message);
    });

    request.write(data);
    request.end();
}

/**
 * The method sends request to Open Route Service for making routing based on the provided coordinates.
 * Read more from Open Route Service API docs directions section.
 * @param {Array.<Array.<number>>} coordinates array with coordinates in form [lon, lat]
 * @param {Object} options options objects for the route
 * @param {Object} req request object
 * @param {Object} res response object
 * @param {Object} additionalDataObj additional data need to be sent to the client side
 * @returns {Promise<null>}
 */
async function makeRoutingRequest(coordinates, options, req, res, additionalDataObj){
    if(coordinates != null && coordinates.length > 0){
        let fuelusage = req.body.fuelusage;
        if(fuelusage == null){
            fuelusage = 8.9;
        }
        let data = JSON.stringify({
            coordinates:coordinates,
            continue_straight:true,
            instructions:true,
            options: options,
            units:"m"
        });
        const apiOptions = apiRequestUtil.getORSSettings('/v2/directions/driving-car/geojson');
        apiOptions.headers["Content-Length"] = data.length;
        //const price = await fuelPriceJSON("finland");
        const price = {
            diesel: "1.9",
            gasoline: "1.83"
        };

        const request = await https.request(apiOptions, (response) => {
            let data = '';

            response.on('data', (chunk) => {
                data += chunk;
            });

            response.on('end', () => {
                try {
                    const JsonData = JSON.parse(data);
                    const routeDistance = JsonData.features[0].properties.summary.distance;
                    const fuelSpent = calcFuel(routeDistance, fuelusage);

                    JsonData.features[0].properties.summary.fuelusage = fuelSpent;
                    JsonData.features[0].properties.summary.pricedata = price;
                    JsonData.features[0].properties.summary.routeCost = calcRoutePrice(price, fuelSpent);
                    JsonData.features[0].properties.summary.co2 = calcCO2(routeDistance, fuelusage);

                    if(additionalDataObj != null){
                        for(const property in additionalDataObj){
                            JsonData.features[0].properties.summary[property] = additionalDataObj[property];
                        }
                    }

                    res.send(JsonData);
                }catch (err) {
                    res.send(undefined);
                }
            });

        }).on("error", (err) => {
            console.log("Error: ", err.message);
        });

        request.write(data);
        request.end();
    } else {
        return null;
    }
}

export default router;