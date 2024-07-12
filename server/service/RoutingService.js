import isRespServiceError, { validateInput } from "../router/api/v2/routeBuilder/core/service/validateInput.js";
import { ServiceError } from "../router/api/v2/routeBuilder/core/service/dataExtractors/error/ServiceError.js";
import { SEReason } from "../router/api/v2/routeBuilder/core/service/dataExtractors/error/SEReason.js";
import APILimitTracker from "../util/APILimitTracker.js";
import { SERVICE_ERROR_TYPE_NAME } from "../router/api/v2/routeBuilder/core/config.js";
import { routingCoordinates, routingOrders } from "./validation/routing.js";
import CityCenterUtil from "../util/CityCenterUtil.js";
import AreaService from "./AreaService.js";
import OrderDataService from "./OrderDataService.js";

const areaDAO = new AreaService();
const orderService = new OrderDataService();

export default class RoutingService {
    constructor() {}
    
    
    findRouteByCoordinates = validateInput(async (request) => {
        const {
            coordinates,
            startCoordinateIndex, endCoordinateIndex,
            avoidCityCenters, cityCentersToAvoid, isTrafficSituation
        } = request; 

        const start = (startCoordinateIndex != null && isIndexValid(startCoordinateIndex, coordinates)) ? coordinates[startCoordinateIndex] : undefined;
        const end = (endCoordinateIndex != null && isIndexValid(endCoordinateIndex, coordinates)) ? coordinates[endCoordinateIndex] : undefined;

        // Prepare the jobs array from coordinates
        const jobs = coordinates.map((coord, index) => ({
            id: index + 1,
            service: 300, //default service time
            location: coord
        }));

        const key = process.env.ORS_API_KEY;
        const optimizedCoords = await this.#optimizeRoute(key, start, end, {jobs});
        if(!optimizedCoords)
            return new ServiceError({ reason: SEReason.NOT_FOUND, message: 'Could not find the route for requested coordinates' });
    
        return this.#findRoute(key, optimizedCoords, avoidCityCenters, cityCentersToAvoid, isTrafficSituation);
    }, routingCoordinates);

    findRouteByOrderIds = validateInput(async (request) => {
        try{
            const {
                orderIds, 
                startOrderId, endOrderId,
                avoidCityCenters, cityCentersToAvoid, isTrafficSituation
            } = request;
            const queriedOrders = await orderService.readAllByIds(orderIds);
            if(isRespServiceError(queriedOrders))
                return queriedOrders;
    
            const areErrorsInOrders = validateOrders(queriedOrders);
            if(areErrorsInOrders)
                return areErrorsInOrders;

            let startOrder, endOrder;
            if(startOrderId){
                startOrder = queriedOrders.find(o => o.id === startOrderId);
                if(!startOrder)
                    return new ServiceError({reason: SEReason.NOT_FOUND, message: 'Could not find starting order', field: 'startOrderId'});
            }
                
            if(endOrderId){
                endOrder = queriedOrders.find(o => o.id === endOrderId);
                if(!endOrder)
                    return new ServiceError({reason: SEReason.NOT_FOUND, message: 'Could not find ending order', field: 'endOrderId'});
            }

            const start = startOrder ? [startOrder.Sender.lon, startOrder.Sender.lat] : undefined;
            const end = endOrder ? [endOrder.Recipient.lon, endOrder.Recipient.lat] : undefined;
            const shipments = this.#getShipmentDeliveryRequestBody(queriedOrders);
            const key = process.env.ORS_API_KEY;

            const optimizedCoords = await this.#optimizeRoute(key, start, end, shipments);
            if(!optimizedCoords || optimizedCoords.length === 0)
                return new ServiceError({ reason: SEReason.NOT_FOUND, message: 'Could not find the route for requested orders' });

            if(isRespServiceError(optimizedCoords))
                return optimizedCoords;

            return this.#findRoute(key, optimizedCoords, avoidCityCenters, cityCentersToAvoid, isTrafficSituation);
        } catch (err){
            console.log(err);
            return res.status(500).send({error: 'Failed to fetch routing data'});
        }
    }, routingOrders);

    /**
    * Optimize the order in which coordinates should be visited
    *
    * @param {string} key for API request
    * @param {number[] | undefined} start coordinate
    * @param {number[] | undefined} end coordinate
    * @param {{ shipments?: [], jobs?: [] }=} options additional settings
    * @returns {Promise<any | ServiceError>} coordinates in optimized order or Service error if not succeeded 
    */
    #optimizeRoute = async (key, start, end, options = {}) => {
        const areRequests = APILimitTracker.areRequestsLeft('ors', 'optimize');
        if(!areRequests)
            return new ServiceError({ reason: SEReason.LIMIT_EXCEEDED });

        const vehicles = [ { id: 1, profile: 'driving-car', start: start ?? undefined, end: end ?? undefined } ];

        // The request payload
        const body = { ...options, vehicles };
        const optimizationResp = await orsRequest('https://api.openrouteservice.org/optimization', key, body);
        if(!optimizationResp || !optimizationResp.routes)
            return null;

        // Extract the ordered coordinates from the response
        return optimizationResp.routes.map(route =>
            route.steps.filter(step => this.#isValidStep(step)).map(step => step.location)
        ).flat();
    }

    #isValidStep = (step) => {
        return step.type === 'job' | step.type === 'pickup' | step.type === 'delivery';
    }

    #findRoute = async (key, coordinates, avoidCityCenters, cityCentersToAvoid, isTrafficSituation) => {
        const url = `https://api.openrouteservice.org/v2/directions/driving-car/geojson`;
        const routingBody = { coordinates, instructions: false };
        let avoidMultiPolygon = await determineAvoidPolygon(avoidCityCenters, cityCentersToAvoid, isTrafficSituation);
        if(avoidMultiPolygon)
            routingBody.options = {avoid_polygons: avoidMultiPolygon};
    
        return orsRequestResponse(url, key, routingBody);
    }

    /**
     * The method generate request object for the VRoom project based on the provided order objects array.
     * The method may be used when shipment and delivery addresses are specified.
     * @param {Array.<Object>} orderArr array of order objects
     * @returns {null | Object} generated request object for the VRoom project service
     */
    #getShipmentDeliveryRequestBody = (orderArr) => {
        if(orderArr?.length === 0)
            return null;

        let result = { shipments: [], vehicles: [] }
        for(let i=0, l=orderArr.length; i<l; i++){
            const {Sender, Recipient} = orderArr[i];

            result.shipments[i] = {
                pickup: this.#generateShipmentStep(i+1, Sender.lon, Sender.lat),
                delivery: this.#generateShipmentStep(i+1, Recipient.lon, Recipient.lat)
            };
        }

        return result;
    }

    /**
    * The method generates step object for the Vroom project
    * For detailed information see the VRoom project documentation step section
    * @param {number} id id of the step
    * @param {number} lon 
    * @param {number} lat 
    * @returns {{id: number, location: number[]}} step object for the Vroom project
    */
    #generateShipmentStep = (id, lon, lat) => {
        return { id, location: [lon, lat] }
    }
}

async function orsRequestResponse(url, token, body) {
    const resp = await orsRequest(url, token, body);
    if(!resp)
        return new ServiceError({ reason: SEReason.UNEXPECTED, message: 'Failed to find any route' });

    if(resp.type === SERVICE_ERROR_TYPE_NAME.description)
        return resp;

    const { features } = resp;
    return {
        route: features[0],
        info: features[0]?.properties?.summary
    }
}

/**
 * 
 * @param {string} url where to send request
 * @param {string} token of ORS
 * @param {*} body to send
 * @returns {Promise<any | ServiceError>} ORS response or Service error if not succeeded
 */
async function orsRequest(url, token, body) {
    try{
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json; charset=utf-8',
                'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8'
            },
            body: JSON.stringify(body)
        });

        if(!response.ok)
            return new ServiceError({ reason: SEReason.UNEXPECTED, message: `ORS request failed with status: ${response.status}` });

        return await response.json();
    }catch (error){
        return new ServiceError({ reason: SEReason.UNEXPECTED, message: `ORS request failed with status: ${response.status}`, additional: error });
    }
}

function isIndexValid(index, array) {
    return index !== undefined && index !== null && (index >= 0) && (index < array.length);
}

/**
 * 
 * @param {any[]} orders 
 * @returns {ServiceError[] | null} null if valid
 */
function validateOrders(orders) {
    const errors = [];
    for(let i=0, l=orders.length; i<l; i++){
        const order = orders[i];
        if(!order.Sender)
            errors.push(new ServiceError({reason: SEReason.NOT_FOUND, message: `Could not find a Sender for order with id ${order.id}`, field: 'Sender.id'}));
        else if(!order.Sender.lon || !order.Sender.lat)
            errors.push(new ServiceError({reason: SEReason.NOT_FOUND, message: `Could not find a Sender coordinates for order with id ${order.id}`, field: 'Sender'}));

        if(!order.Recipient)
            errors.push(new ServiceError({reason: SEReason.NOT_FOUND, message: `Could not find a Recipient for order with id ${order.id}`, field: 'Recipient.id'}));
        else if(!order.Recipient.lon || !order.Recipient.lat)
            errors.push(new ServiceError({reason: SEReason.NOT_FOUND, message: `Could not find a Recipient coordinates for order with id ${order.id}`, field: 'Recipient'}));
    }

    return errors.length === 0 ? null : errors;
}

async function determineAvoidPolygon(avoidCityCenters, cityCentersToAvoid, isTrafficSituation) {
    let avoidMultiPolygon = { type: "MultiPolygon", coordinates: [] };
    let cities = null;
    if(avoidCityCenters)
        cities = await CityCenterUtil.getAllCityCentersArr();
    else if(cityCentersToAvoid && cityCentersToAvoid.length > 0)
        cities = await CityCenterUtil.getCityCentersByNames(cityCentersToAvoid);

    let slowTraffic = null;
    if(isTrafficSituation){
        const slowArea = await areaDAO.read('SlowTraffic');
        slowTraffic = JSON.parse(slowArea.polygon);
    }

    if(cities)
        avoidMultiPolygon.coordinates = [...cities.map(p => p.coordinates)];
    if(slowTraffic)
        avoidMultiPolygon.coordinates = avoidMultiPolygon.coordinates.concat(slowTraffic.coordinates);

    return avoidMultiPolygon.coordinates.length !== 0 ? avoidMultiPolygon : null;
}