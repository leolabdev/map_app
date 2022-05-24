const axios = require("axios");
const StringValidator = require('./StringValidator').StringValidator;

const stringValidator = new StringValidator();

/**
 * The class has functionality for helping communicate with DAO package classes
 */
class DaoUtil{
    /**
     * The method gets all the data values from Sequelize ORM response, i.e. get all data related only to the object(address, client etc.) without extra data
     * @param {Array} respArr response array from Sequelize ORM
     * @returns {null|*[]} array with ORM objects
     */
    getDataValues(respArr){
        if(respArr != null){
            let result = [];
            for(let i=0; i<respArr.length; i++){
                result[i] = respArr[i].dataValues;
            }
            return result;
        } else {
            return null;
        }
    }

    /**
     * The method gets all the data values from Sequelize ORM response for the order request, i.e. get all data related only to the object without extra data
     * @param {Array} orderResp order response array from Sequelize ORM
     * @returns {null|*[]} array with order objects
     */
    unpackOrderResp(orderResp){
        if(orderResp != null){
            let result = [];
            for(let i=0; i<orderResp.length; i++){
                let orderData =  orderResp[i].dataValues;
                const manufacturer = orderData.Manufacturer.dataValues;
                const client = orderData.Client.dataValues;
                const shipmentAddress = orderData.shipmentAddress.dataValues;
                const deliveryAddress = orderData.deliveryAddress.dataValues;

                orderData.Manufacturer = manufacturer;
                orderData.Client = client;
                orderData.shipmentAddress = shipmentAddress;
                orderData.deliveryAddress = deliveryAddress;

                result[i] = orderData;
            }
            return result;
        } else {
            return null;
        }
    }

    /**
     * The method gets all the data values from Sequelize ORM response for the order request, i.e. get all data related only to the object without extra data
     * @param {Object} order order response object from Sequelize ORM
     * @returns {null|*[]} order object
     */
    unpackOrder(order){
        const orderData = { orderId: order.orderId };
        const manufacturer = order.Manufacturer.dataValues;
        const client = order.Client.dataValues;
        const shipmentAddress = order.shipmentAddress.dataValues;
        const deliveryAddress = order.deliveryAddress.dataValues;

        orderData.Manufacturer = manufacturer;
        orderData.Client = client;
        orderData.shipmentAddress = shipmentAddress;
        orderData.deliveryAddress = deliveryAddress;

        return orderData;
    }

    /**
     * The method gets address data including coordinates by street address.
     * @param {String} street street name
     * @param {String} building building number in form 34 or 45 A
     * @param {String} city name of the city
     * @returns {Promise<AxiosResponse<any>|null>} founded address data
     */
    async getAddressData(street, building, city) {
        if(street != null && building != null && city != null){
            const address = street + " " + building + ", " + city;
            return await axios.get(`http://localhost:8081/api/v1/address/search?text=` + address);
        } else{
            return null;
        }
    }

    /**
     * The method gets all saved information from the Address SQL table by street address
     * @param {String} street street name
     * @param {String} building building number in form 34 or 45 A
     * @param {String} city name of the city
     * @returns {Promise<AxiosResponse<any>|null>} founded address data as address ORM object
     */
    async getAddressesDataFromDB(street, building, city){
        if(street != null && building != null && city != null){
            return await axios.get(`http://localhost:8081/dao/address/search/?city=${city}&street=${street}&building=${building}`);
        } else{
            return null;
        }
    }

    /**
     * The method converts GeoJSON polygon or multipolygon to area object, which later can be saved to the Area SQL table
     * @param {Object} polygonObj GeoJSON polygon or multipolygon object to convert
     * @returns {null|Object|Array.<Object>} area ORM object(or array of these objects) or null if something went wrong
     */
    parsePolygonToAreaCoordinates(polygonObj){
        let result = null;

        const {areaName,type} = polygonObj;

        if(type === "Polygon"){
            result = convertPolygonToArea(polygonObj.coordinates, areaName, 0);
        } else if(type === "MultiPolygon"){
            result = [];
            const polygons = polygonObj.coordinates;
            for(let i = 0; i < polygons.length; i++){
                result.push(...convertPolygonToArea(polygons[i], areaName, i));
            }
        }

        return result;
    }

    /**
     * The method converts area ORM object to the GeoJSON polygon or multipolygon object
     * @param areaObj area ORM object to convert
     * @returns {null|Object} GeoJSON polygon or multipolygon object
     */
    parseAreaCoordinatesToPolygon(areaObj){
        let result = null;
        if(areaObj != null){
            const type = areaObj.type;
            if(type === "Polygon"){
                const areaCoords = this.getDataValues(areaObj.AreaCoordinates);

                const coordinates = [];
                for(let i = 0; i < areaCoords.length; i++){
                    const currentCoords = areaCoords[i];
                    if(coordinates[currentCoords.polygonNumber] == null){
                        coordinates[currentCoords.polygonNumber] = [];
                    }

                    coordinates[currentCoords.polygonNumber][currentCoords.orderNumber] = [currentCoords.lon, currentCoords.lat];
                }

                result = {
                    type: type,
                    coordinates: coordinates
                }
            } else if(type === "MultiPolygon"){
                const areaCoords = this.getDataValues(areaObj.AreaCoordinates);

                const coordinates = [];
                for(let i = 0; i < areaCoords.length; i++){
                    const currentCoords = areaCoords[i];
                    if(coordinates[currentCoords.polygonNumber] == null){
                        coordinates[currentCoords.polygonNumber] = [[]];
                    }
                    coordinates[currentCoords.polygonNumber][0][currentCoords.orderNumber] = [currentCoords.lon, currentCoords.lat];
                }

                result = {
                    type: type,
                    coordinates: coordinates
                }
            }
        }

        return result;
    }

    /**
     * The method checks does given array contains any nulls or not
     * @param {Array} arr array to be checked
     * @returns {boolean} does array contains any nulls or not
     */
    containNoNullArr(arr){
        if(arr != null){
            for(let i = 0; i < arr.length; i++){
                if(arr[i] == null)
                    return false;
            }

            return true;
        } else{
            return false;
        }
    }

    /**
     * The method checks does given array contains any blank strings or not
     * @param {Array.<string>} arr array to be checked
     * @returns {boolean} does array contains any blank strings or not
     */
    containNoBlankArr(arr){
        if(arr != null){
            for(let i = 0; i < arr.length; i++){
                if(arr[i] != null){
                    if(stringValidator.isBlank(arr[i]))
                        return false;
                }
            }

            return true;
        } else{
            return false;
        }
    }
}

/**
 * The method converts GeoJSON polygon object to the area coordinates ORM object
 * @param {Object} polygon GeoJSON polygon object
 * @param {string} areaName area name
 * @param {number} polygonNumber polygon order number
 * @returns {*[]} array of the area coordinates objects
 */
function convertPolygonToArea(polygon, areaName, polygonNumber) {
        const result = [];
        if(polygon != null){
            const lonLatArr = polygon[0];
            if(lonLatArr != null){
                for(let i = 0; i < lonLatArr.length; i++){
                    const coordinate = {
                        areaName: areaName,
                        polygonNumber: polygonNumber,
                        orderNumber: i,
                        lon: lonLatArr[i][0],
                        lat: lonLatArr[i][1]
                    };
                    result.push(coordinate);
                }
            }
        }

        return result;
}

module.exports.DaoUtil = DaoUtil;