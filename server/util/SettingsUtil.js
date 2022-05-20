const axios = require("axios");
const TMSDAO = require("../DAO/TMSDAO");
const PolygonUtil = require("../util/PolygonUtil");

const tmsDAO = new TMSDAO();
const polygonUtil = new PolygonUtil();

class SettingsUtil {
    async setUp(){
        try{ await addCityCenters(); } catch (e) { console.log("Failed to add city centers"); }
        try{ await addTMS(); } catch (e) { console.log("Failed to add TMSs"); }
        try{ await addTMSAreas(); } catch (e) { console.log("Failed to add TMS areas"); }
    }
}
module.exports = SettingsUtil;

async function addCityCenters() {
    await axios.post(`http://localhost:8081/dao/area`, HelsinkiCenter);
    await axios.post(`http://localhost:8081/dao/area`, LahtiCenter);
}

async function addTMS() {
    const tmsObj = {};
    const tmsData = await axios.get("https://tie.digitraffic.fi/api/v1/data/tms-data", {
        headers: {
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'accept-encoding': 'gzip, deflate, br'
        }
    });

    const stations = tmsData.data.tmsStations;
    for(let i=0; i<stations.length; i++){
        const currentStation = stations[i];

        const tms = { stationId: currentStation.id };

        let isSensor1Found = false;
        let isSensor2Found = false;
        for(let j=0; j<currentStation.sensorValues.length; j++){
            const sensor = currentStation.sensorValues[j];
            if(sensor.name === "KESKINOPEUS_5MIN_LIUKUVA_SUUNTA1_VVAPAAS1"){
                tms.sensor1Id = sensor.id;
                isSensor1Found = true;
                if(isSensor2Found){
                    break;
                }
                continue;
            }
            if(sensor.name === "KESKINOPEUS_5MIN_LIUKUVA_SUUNTA2_VVAPAAS2"){
                tms.sensor2Id = sensor.id;
                isSensor2Found = true;
                if(isSensor1Found){
                    break;
                }
            }
        }

        if(isSensor1Found || isSensor2Found){
            tmsObj[currentStation.id] = tms;
        }
    }

    const metaData = await axios.get("https://tie.digitraffic.fi/api/v3/metadata/tms-stations", {
        headers: {
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'accept-encoding': 'gzip, deflate, br'
        }
    });
    const stationsMeta = metaData.data.features;
    for(let i=0; i<stationsMeta.length; i++){
        const id = stationsMeta[i].id;
        if(tmsObj[id] != null && tmsObj[id].stationId === id){
            tmsObj[id].lon = stationsMeta[i].geometry.coordinates[0];
            tmsObj[id].lat = stationsMeta[i].geometry.coordinates[1];
        }
    }

    await tmsDAO.createMultiple(Object.values(tmsObj));
}

async function addTMSAreas() {
    const stations = await tmsDAO.readAll();
    const areas = [];
    for(let i=0; i<stations.length; i++){
        const centerCoordinates = [stations[i].lon, stations[i].lat];
        const polygonCoordinates = polygonUtil.generateSquarePolygonCoordinates(centerCoordinates, 0.0001415);

        const area = {
            "areaName": "tms"+stations[i].stationId,
            "type": "Polygon",
            "coordinates": polygonCoordinates
        }
        areas.push(area);
    }

    await axios.post("http://localhost:8081/dao/area/multiple", areas);
}

//Helsinki center coordinates in Polygon form
const HelsinkiCenter = {
    "areaName": "HelsinkiCenter",
    "type": "Polygon",
    "coordinates": [
        [
            [24.92188453674316,60.1720009743249],
            [24.924287796020508,60.16260738958614],
            [24.930896759033203,60.1623511632902],
            [24.93475914001465,60.158123140977864],
            [24.956903457641598,60.16021586646705],
            [24.95510101318359,60.16896970183465],
            [24.92188453674316,60.1720009743249]
        ]
    ]
};

const LahtiCenter = {
    "areaName": "LahtiCenter",
    "type": "Polygon",
    "coordinates": [
        [
            [25.654878616333004,60.98514074901049],
            [25.65007209777832,60.98268442445237],
            [25.65007209777832,60.980852465601075],
            [25.65582275390625,60.98056100786631],
            [25.655651092529297,60.979020401155694],
            [25.671615600585938,60.979353511636425],
            [25.668354034423825,60.98426648575919],
            [25.654878616333004,60.98514074901049]
        ]
    ]
};