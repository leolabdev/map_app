import TMSService from "../../service/TMSService.js";
import { readFile } from 'fs/promises';
import AreaService from "../../service/AreaService.js";
import SequelizeUtil from "../../modules/SequelizeUtil.js";


const tmsDAO = new TMSService();
const areaDAO = new AreaService();

/**
 * The class provides functionality for setting up the software parts
 */
export default class SettingsUtil {

    constructor({cityCentersFileLocation}){
        this.#cityCentersFileLocation = cityCentersFileLocation;
        this.#areaDAO = new AreaService();
    }
    #cityCentersFileLocation = null;
    #areaDAO = null;

    /**
     * The method sets the software up.
     * It should be called once on the server first run, after the DB SQL script was executed
     * @returns {Promise<void>}
     */
    async setUp(){
        if(!await this.#addCityCenters())
            console.error('Failed to add city centers');
        if(!await addTMSDataToDB())
            console.error('Failed to add TMSs');
    }

    /**
     * The method adds areas of city centers to the DB, which are used for avoid city centers routing option
     * @returns {Promise<boolean>}
     */
    async #addCityCenters(force=false) {
        if(!force){
            const cityCentersFound = await countAll('Area', 'areaName');
            if(cityCentersFound > 0)
                return true;
        }

        const cityCenters = await convertCityCentersFileToGeoJson(this.#cityCentersFileLocation);
        if(!cityCenters){
            console.error(`No ${this.#cityCentersFileLocation} file found or it is in wrong format`);
            return false;
        }

        await areaDAO.deleteAllCityCenters();

        for(const key in cityCenters){
            const polygon = cityCenters[key];
            const areaName = key + 'Center';

            try {
                const areaFound = await this.#areaDAO.read(areaName);
                if(areaFound)
                    continue;

                await this.#areaDAO.create({areaName, polygon});
            } catch (e) {
                console.error('SettingsUtil: Could not create or read city centers');
                return false;
            }
        }

        const centersCount = Object.keys(cityCenters).length;
        const centersCreated = await countAll('Area', 'areaName');
        return centersCreated === centersCount;
    }
}



async function convertCityCentersFileToGeoJson(filePath) {
    try {
        if(!filePath || !filePath.includes(".json"))
            return null;

        // Read the file asynchronously
        const fileContent = await readFile(filePath, 'utf8');
        // Parse the JSON content
        const inputJson = JSON.parse(fileContent);

        const cityCenters = {};

        for (const city in inputJson) {
            if (inputJson.hasOwnProperty(city)) {
                cityCenters[city] = {
                    type: "Polygon",
                    coordinates: inputJson[city].coordinates
                };
            }
        }

        return cityCenters;
    } catch (error) {
        console.error("An error occurred:", error);
        return null;
    }
}


export async function updateTrafficSituation(maxAcceptableValue){
    const areaName = 'SlowTraffic';
    await areaDAO.delete(areaName);

    const slowStationIds = await getSlowTMSIds(maxAcceptableValue);
    const stationPolygon = await tmsDAO.readMultipleByIds(slowStationIds);

    const multiPolygon = {
        type: 'MultiPolygon',
        coordinates: []
    }
    for(const p of stationPolygon)
        multiPolygon.coordinates.push([JSON.parse(p.polygonCoordinates)]);

    await areaDAO.create({areaName, polygon: multiPolygon});
}


export async function getSlowTMSIds(maxAcceptableValue = 90) {
    const url = 'https://tie.digitraffic.fi/api/tms/v1/stations/data';
    try {
        const tmsResp = await fetch(url);
        if (!tmsResp.ok) {
            console.error(`Could not get response of traffic situation from ${url}`);
            return null;
        }
        const tmsData = await tmsResp.json();
        if (!tmsData || !tmsData.stations || !Array.isArray(tmsData.stations)) {
            console.error('Could not get any traffic data');
            return null;
        }

        const result = [];
        for (const station of tmsData.stations) {
            if (!station || !station.id || !station.sensorValues) {
                continue;
            }

            for (const sensor of station.sensorValues) {
                if(!sensor.name || !sensor.value || !sensor.id)
                    continue;

                if (sensor.name === 'KESKINOPEUS_5MIN_LIUKUVA_SUUNTA1_VVAPAAS1' || sensor.name === 'KESKINOPEUS_5MIN_LIUKUVA_SUUNTA2_VVAPAAS2') {
                    if (sensor.value < maxAcceptableValue) {
                        result.push(station.id);
                        break;
                    }
                }
            }
        }

        return result;
    } catch (e) {
        console.error('Error on getting traffic data:', e);
        return null;
    }
}

export async function addTMSDataToDB(force=false, tmsAreaSizeM=15) {
    if(!force){
        const tmsCount = await countAll('TMS', 'stationId');
        if(tmsCount > 0)
            return true;
    }

    await tmsDAO.deleteAll();

    const tmsData = await getTMSData(tmsAreaSizeM);
    if(!tmsData)
        return false;

    await tmsDAO.createMultiple(tmsData);
    const tmsCount = await countAll('TMS', 'stationId');
    return tmsCount === tmsData.length;
}

export async function getTMSData(tmsAreaSizeM=15){
    const url = 'https://tie.digitraffic.fi/api/tms/v1/stations';
    try {
        const tmsResp = await fetch(url);
        if (!tmsResp.ok) {
            console.error(`Could not get response with TMS data from ${url}`);
            return null;
        }
        const tmsData = await tmsResp.json();
        if (!tmsData || !tmsData.features || !Array.isArray(tmsData.features)) {
            console.error('Could not get any TMS data');
            return null;
        }

        const result = [];
        for (const station of tmsData.features) {

            if (!station || !station.id || !station.geometry || !station.geometry.coordinates || (station.geometry.coordinates.length < 2))
                continue;

            const [lon, lat] = station.geometry.coordinates;
            const polygonCoordinates = JSON.stringify(generateSquareFromPoint({lon, lat}, tmsAreaSizeM));
            result.push({stationId: station.id, lon, lat, polygonCoordinates});
        }

        return result;
    } catch (e) {
        console.error('Error on getting TMS data:', e);
        return null;
    }
}

async function countAll(table, field='*') {
    const [results, metadata] = await SequelizeUtil.getSequelizeInstance().query(`SELECT COUNT(${field}) FROM ${table}`);
    return results[0][`COUNT(${field})`];
}

//[lon, lat]
export function generateSquareFromPoint(center, sizeM) {
    const {lon, lat} = center;
    // Earth’s radius, in meters
    const R = 6378137;

    // Convert size from meters to degrees (approximately)
    const deltaDegree = (sizeM / 2) / (Math.PI / 180 * R);

    // Calculate approximate offsets in latitude and longitude
    const deltaLat = deltaDegree;  // Change in latitude in degrees
    const deltaLon = deltaDegree / Math.cos(lat * Math.PI / 180);  // Change in longitude in degrees, corrected

    // Define the coordinates of the square (GeoJSON polygons require the first and last positions to be the same)
    return [
        [lon - deltaLon, lat - deltaLat], // bottom-left
        [lon - deltaLon, lat + deltaLat], // top-left
        [lon + deltaLon, lat + deltaLat], // top-right
        [lon + deltaLon, lat - deltaLat], // bottom-right
        [lon - deltaLon, lat - deltaLat]  // closing the polygon at bottom-left
    ];
}
