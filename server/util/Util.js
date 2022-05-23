const axios = require("axios");
const TMSDAO = require("../DAO/TMSDAO");
const {DataDAO} = require("../DAO/Data");

const tmsDAO = new TMSDAO();
const dataDAO = new DataDAO();

class Util {
    getOrdersCities(orders){
        const cities = new Set();
        for(let i=0; i<orders.length; i++){
            const {shipmentAddress, deliveryAddress} = orders[i];
            cities.add(shipmentAddress.city);
            cities.add(deliveryAddress.city);
        }

        return cities;
    }

    async updateTrafficSituation(minSpeed){
        const slowTrafficStationIds = await getSlowTrafficStationIds(minSpeed);
        if(slowTrafficStationIds.length > 0){
            const slowAreasMultiPolygon = {
                areaName: "SlowTraffic",
                "type": "MultiPolygon",
                "coordinates": []
            };
            for(let i=0; i<slowTrafficStationIds.length; i++){
                const areaResp = await axios.get("http://localhost:8081/dao/area/tms" + slowTrafficStationIds[i]);
                const polygonCoordinates = areaResp.data.result.coordinates;
                slowAreasMultiPolygon.coordinates.push(polygonCoordinates);
            }

            await dataDAO.update( {name: "TrafficSituation", value: "updated"} );
            return await axios.put("http://localhost:8081/dao/area", slowAreasMultiPolygon);
        }
    }
}

async function getSlowTrafficStationIds(minSpeed) {
    const tmsData = await axios.get("https://tie.digitraffic.fi/api/v1/data/tms-data", {
        headers: {
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'accept-encoding': 'gzip, deflate, br'
        }
    });

    const stations = await tmsDAO.readAll();
    const stationsObj = {};
    for(let i=0; i<stations.length; i++){
        stationsObj[stations[i].stationId] = stations[i];
    }

    const slowTrafficStationIds = [];
    const stationsData = tmsData.data.tmsStations;
    for(let i=0; i<stationsData.length; i++){
        const station = stationsData[i];
        const id = station.id;
        if(stationsObj[id] != null){
            const sensor1Id = stationsObj[id].sensor1Id;
            const sensor2Id = stationsObj[id].sensor2Id;

            let isSensor1Visited = false;
            let isSensor2Visited = false;

            for(let j=0; j<station.sensorValues.length; j++){
                if(station.sensorValues[j].id === sensor1Id){
                    const sensorValue = station.sensorValues[j].sensorValue;
                    if(sensorValue < minSpeed){
                        slowTrafficStationIds.push(id);
                        break;
                    }

                    isSensor1Visited = true;
                    if(isSensor2Visited)
                        break;
                }
                if(station.sensorValues[j].id === sensor2Id){
                    const sensorValue = station.sensorValues[j].sensorValue;
                    if(sensorValue < minSpeed){
                        slowTrafficStationIds.push(id);
                        break;
                    }

                    isSensor2Visited = true;
                    if(isSensor1Visited)
                        break;
                }
            }
        }
    }

    return slowTrafficStationIds;
}

module.exports = Util;