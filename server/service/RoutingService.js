import { validateInput } from "../router/api/v2/routeBuilder/core/service/validateInput.js";
import { ServiceError } from "../router/api/v2/routeBuilder/core/service/dataExtractors/error/ServiceError.js";
import { SEReason } from "../router/api/v2/routeBuilder/core/service/dataExtractors/error/SEReason.js";
import {  addressReverse } from "./validation/address.js";
import APILimitTracker from "../util/APILimitTracker.js";
import { SERVICE_ERROR_TYPE_NAME } from "../router/api/v2/routeBuilder/core/config.js";
import { routingCoordinates } from "./validation/routing.js";
import CityCenterUtil from "../util/CityCenterUtil.js";
import AreaService from "./AreaService.js";

const areaDAO = new AreaService();

export default class RoutingService {
    constructor() {}
    
    //TODO: use only this method in the controller:
    // find coordinates, start, end etc. for /orders in the controller
    findRouteByCoordinates = validateInput(async (request) => {
        const {
            coordinates,
            startCoordinateIndex, endCoordinateIndex,
            avoidCityCenters, cityCentersToAvoid, isTrafficSituation
        } = request;
    
        const key = process.env.ORS_API_KEY;
        const optimizedCoords = await this.optimizeRoute(coordinates, key, {
            startIndex: startCoordinateIndex,
            endIndex: endCoordinateIndex,
        });
        if(!optimizedCoords)
            return new ServiceError({ reason: SEReason.NOT_FOUND, message: 'Could not find the route for requested coordinates' });
    
        const url = `https://api.openrouteservice.org/v2/directions/driving-car/geojson`;
        const routingBody = {
            coordinates: optimizedCoords,
            instructions: false
        }
        let avoidMultiPolygon = await determineAvoidPolygon(avoidCityCenters, cityCentersToAvoid, isTrafficSituation);
        if(avoidMultiPolygon)
            routingBody.options = {avoid_polygons: avoidMultiPolygon};
    
        return orsRequestResponse(url, key, routingBody);
    }, routingCoordinates);

    /**
    * Optimize the order in which coordinates should be visited
    *
    * @param {[][]} coordinates in form [lon, lat]
    * @param {string} key for API request
    * @param {{ startIndex: number | undefined, endIndex: number | undefined, estimatedStopTimeS: number | undefined } | undefined} options additional settings
    * @returns {Promise<any | ServiceError>} coordinates in optimized order or Service error if not succeeded 
    */
    optimizeRoute = async function optimizeRoute(coordinates, key, {startIndex, endIndex, estimatedStopTimeS=300} = {}) {
        const areRequests = APILimitTracker.areRequestsLeft('ors', 'optimize');
        if(!areRequests)
            return new ServiceError({ reason: SEReason.LIMIT_EXCEEDED });

        // Prepare the jobs array from coordinates
        const jobs = coordinates.map((coord, index) => ({
            id: index + 1,
            service: estimatedStopTimeS, //default service time
            location: coord
        }));

        const start = isIndexValid(startIndex, coordinates) ? coordinates[startIndex] : coordinates[0];
        const end = isIndexValid(endIndex, coordinates) ? coordinates[endIndex] : coordinates[coordinates.length-1];

        const vehicles = [ { id: 1, profile: 'driving-car', start, end } ];

        // The request payload
        const body = { jobs, vehicles };
        const optimizationResp = await orsRequest('https://api.openrouteservice.org/optimization', key, body);
        if(!optimizationResp || !optimizationResp.routes)
            return null;

        // Extract the ordered coordinates from the response
        return optimizationResp.routes.map(route =>
            route.steps.filter(step => step.type === 'job').map(step => step.location)
        ).flat();
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