import express from "express";
import CityCenterUtil from "../../../util/CityCenterUtil.js";
import AreaDAO from "../../../DAO/AreaDAO.js";

const router = express.Router();

const areaDAO = new AreaDAO();

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
    const {
        coordinates,
        startCoordinateIndex, endCoordinateIndex,
        avoidCityCenters, cityCentersToAvoid, isTrafficSituation,
        fuelusage
    } = req.body;

    if(!coordinates)
        res.status(400).send({error: "coordinates field is required", status: 400});

    //const key = process.env.ORS_API_KEY;
    const key = '5b3ce3597851110001cf62484aa58858909f4d949a4d7f231d54a9fe';

    const optimizedCoords = await optimizeRoute(coordinates, key, {
        startIndex: startCoordinateIndex,
        endIndex: endCoordinateIndex,
    });
    if(!optimizedCoords)
        return res.status(500).send({error: "could not optimize the route", status: 500});

    const url = `https://api.openrouteservice.org/v2/directions/driving-car/geojson`;
    const routingBody = {
        coordinates: optimizedCoords,
        instructions: false
    }
    let avoidMultiPolygon = await determineAvoidPolygon(avoidCityCenters, cityCentersToAvoid, isTrafficSituation);
    if(avoidMultiPolygon)
        routingBody.options = {avoid_polygons: avoidMultiPolygon};

    await orsRequestResponse(url, key, routingBody, res);
});


async function orsRequestResponse(url, token, body, res) {
    const resp = await orsRequest(url, token, body);
    if(!resp)
        return res.status(500).send({error: 'Failed to fetch routing data'});

    const {features} = resp;
    const send = {
        route: features[0],
        info: features[0]?.properties?.summary
    }
    res.status(200).send(features[0]);
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
async function optimizeRoute(coordinates, key, {startIndex, endIndex, estimatedStopTimeS=300, polygonsToAvoid=null} = {}) {
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

export default router;