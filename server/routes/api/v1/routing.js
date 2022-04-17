const express = require('express');
const https = require('https');
const {ValuesDateChecker} = require("../../../util/ValuesDateChecker");
const {DataDAO} = require("../../../DAO/Data");
const {OrderDataDAO} = require("../../../DAO/OrderDataDAO");
const {OptimizationUtil} = require("../../../util/OptimizationUtil");
const {ResponseUtil} = require("../../../util/ResponseUtil");

const router = express.Router();

const valuesDateChecker = new ValuesDateChecker();
const dataDAO = new DataDAO();
const orderDataDAO = new OrderDataDAO();
const optimizationUtil = new OptimizationUtil();
const responseUtil = new ResponseUtil();

/**
 * Default options for https request.
 * REMEMBER TO ADD options.headers["Content-Length"] = data.length; when trying to post data
 * @type {{path: string, headers: {Authorization: string, Accept: string, "Content-Type": string}, protocol: string, hostname: string, method: string, port: number}}
 */
let options = {
    protocol: 'https:',
    hostname: 'api.openrouteservice.org',
    port: 443,
    path: '/v2/directions/driving-car/geojson',
    method: 'POST',
    headers: {
        'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
        'Authorization': process.env.ORS_API_KEY,
        'Content-Type': 'application/json',
    }
};

const fuelOptions = {
    "method": "GET",
    "hostname": "api.collectapi.com",
    "port": null,
    "path": "/gasPrice/europeanCountries",
    "headers": {
        "content-type": "application/json",
        "authorization": "apikey " + process.env.FUEL_API_KEY
    }
};

/**
 * Calculates fuel consumption in route based on route length
 * @param length of route in (m)
 * @param fuelUsage of vehicle (L/100Km)
 * @returns {number} fuel consumption in route
 */
function calcFuel(length, fuelUsage) {
    length = length / 1000.0;
    length = length / 100.0;
    return length * fuelUsage;
}

/**
 * Get fuel price by country
 * return example:
 *  {
 *    currency: 'euro',
 *    lpg: '-',
 *    diesel: '2,260',
 *    gasoline: '2,156',
 *    country: 'Finland'
 *  }
 * @param country
 * @returns {Promise<null/JSON>}
 */
async function fuelPriceJSON(country) {
    const data = await dataDAO.readAll();
    const areValuesOld = valuesDateChecker.areValuesOld(["diesel", "gasoline"], data);
    if(areValuesOld){
        return new Promise(async function (resolve, reject) {
            let requ = await https.request(fuelOptions, function (response) {
                let data = '';
                response.on("data", function (chunk) {
                    data += chunk;
                });
                response.on("end", function () {
                    data = JSON.parse(data);

                    for (let index in data.results) {
                        if (data.results[index].country.toLowerCase().localeCompare(country) === 0) {
                            const fuelPrices = data.results[index];

                            const pricesObj = {...fuelPrices};
                            delete pricesObj.country;
                            delete pricesObj.currency;

                            const fuelNames = Object.keys(pricesObj);
                            for(let i=0; i<fuelNames.length; i++){
                                const requestBody = {
                                    "name": fuelNames[i],
                                    "value": pricesObj[fuelNames[i]]
                                }
                                dataDAO.update(requestBody);
                            }
                            resolve(fuelPrices);
                        }
                    }
                });
            });
            requ.end();
        });
    } else{
        return new Promise(async function (resolve, reject) {
            const result = {};
            for(let i=0; i< data.length; i++){
                const key = data[i].name;
                result[key] = data[i].value;
            }
            result.country = "Finland";
            result.currency = "euro";
            resolve(result);
        });
    }
}

async function getOptimizedRoute(coordinates) {
    try{
        return new Promise(async function (resolve, reject) {
            const reqBody = optimizationUtil.getVROOMRequestObject(coordinates);
            makeOptimizationRequest(reqBody, resolve);
        });
    }catch (err){
        console.log(err);
    }
}

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

async function makeOptimizationRequest(reqBody, resolve) {
    if (reqBody != null) {
        let data = JSON.stringify(reqBody);

        const options1 = {
            protocol: 'https:',
            hostname: 'api.openrouteservice.org',
            port: 443,
            path: '/optimization',
            method: 'POST',
            headers: {
                'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
                'Authorization': process.env.ORS_API_KEY,
                'Content-Type': 'application/json',
            }
        }

        options1.headers["Content-Length"] = data.length;

        const request = await https.request(options1, (response) => {
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
    } else {
        return null;
    }
}

async function makeRoutingRequest(coordinates, req, res, additionalDataObj){
    if(coordinates != null && coordinates.length > 0){
        let fuelusage = req.body.fuelusage;
        if(fuelusage == null){
            fuelusage = 8.9;
        }
        let data = JSON.stringify({
            coordinates:coordinates,
            continue_straight:true,
            instructions:true,
            units:"m"
        });
        options.headers["Content-Length"] = data.length;
        const price = await fuelPriceJSON("finland");

        const request = await https.request(options, (response) => {
            let data = '';

            response.on('data', (chunk) => {
                data += chunk;
            });

            response.on('end', () => {
                let JsonData;
                try {
                    JsonData = JSON.parse(data);
                    JsonData.features[0].properties.summary.fuelusage = calcFuel(JsonData.features[0].properties.summary.distance, fuelusage);
                    JsonData.features[0].properties.summary.pricedata = price;

                    if(additionalDataObj != null){
                        for(const property in additionalDataObj){
                            JsonData.features[0].properties.summary[property] = additionalDataObj[property];
                        }
                    }

                    res.send(JsonData);
                }catch (err) {
                    res.send(JsonData);
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
router.post('/routing', async (req, res) => {
    try{
        let coordinates = req.body.coordinates;
        const optimizationResp = await getOptimizedRoute(coordinates);
        coordinates = optimizationUtil.getOptimizedCoordinates(optimizationResp);
        makeRoutingRequest(coordinates, req, res);
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
 *     *optional start : [24.573798698987527,60.19074881467758], (lon, lat)
 *     *optional end : [24.573798698987527,60.19074881467758], (lon, lat)
     *     fuelusage: 5.7
 *  }
 */
router.post('/routing/orders', async (req, res) => {
    try{
        const orderIds = req.body.orderIds;
        const start = req.body.start;
        const end = req.body.end;
        const queriedOrders = await orderDataDAO.readByIds(orderIds);

        const optimizationResp = await getOptimizedShipmentDelivery(queriedOrders, start, end);
        const coordinates = optimizationUtil.getOptimizedCoordinates(optimizationResp);
        const respOrders = responseUtil.sortOrdersByShipmentAddress(queriedOrders);

        makeRoutingRequest(coordinates, req, res, { orders: respOrders });
    }catch (err){
        console.log(err);
    }
});


module.exports = router;