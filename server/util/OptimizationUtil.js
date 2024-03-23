/**
 * This class provides functionality for working with the VRoom project
 */
export default class OptimizationUtil{
    /**
     * The method generate request object for the VRoom project based on the provided coordinates.
     * The method may be used in case if shipment and delivery addresses are not specified.
     * @param {Array.<Array>} coordinates array with coordinates in form [lon, lat]
     * @returns {{jobs: *[], vehicles: *[]}|null} request to the VRoom project service
     */
    getVROOMRequestObject(coordinates){
        if(coordinates != null){
            const result = {
                jobs: [],
                vehicles:[]
            }

            coordinates = sortCoordinatesLeftToRight(coordinates);

            if(coordinates != null){
                for(let i=0; i<coordinates.length; i++){
                    const point = coordinates[i];
                    const job = {
                        "id": i+1,
                        "location": point,
                        "skills": []
                    }
                    result.jobs[i] = job;
                }

                result.vehicles[0] = generateVehicle(1, coordinates[0]);

                return result;
            }
            return null;
        }

        return null;
    }

    /**
     * The method gets array of coordinates from the VROom project service response
     * @param vroomRes response came from the VRoom project
     * @returns {null|*[]} array with coordinates in the form [lon, lan]
     */
    getOptimizedCoordinates(vroomRes){
        if(vroomRes.routes != null && vroomRes.routes[0] != null){
            let result = [];
            const steps = vroomRes.routes[0].steps;
            for(let i=0; i < steps.length; i++){
                if(steps[i].type === "job" || steps[i].type === "start" || steps[i].type === "pickup" || steps[i].type === "delivery" || steps[i].type === "end"){
                    result.push(steps[i].location);
                }
            }

            return result;
        }

        return null;
    }

    /**
     * The method generate request object for the VRoom project based on the provided order objects array.
     * The method may be used when shipment and delivery addresses are specified.
     * @param {Array.<Object>} orderArr array of order objects
     * @param {Array.<number>=} start start coordinate in the form [lon, lat], optional parameter
     * @param {Array.<number>=} end end coordinate in the form [lon, lat], optional parameter
     * @returns {null|Object} generated request object for the VRoom project service
     */
    getShipmentDeliveryRequestBody(orderArr, start, end){
        let result = null;
        if(orderArr != null && orderArr.length > 0){
            result = {
                shipments: [],
                vehicles:[]
            }
            for(let i=0; i < orderArr.length; i++){
                const shipmentAddress = orderArr[i].shipmentAddress;
                const deliveryAddress = orderArr[i].deliveryAddress;

                const pickup = generateShipmentStep(i+1, shipmentAddress);
                const delivery = generateShipmentStep(i+1, deliveryAddress);

                result.shipments[i] = {
                    pickup: pickup,
                    delivery: delivery
                };
            }

            if(start == null)
                start = [ orderArr[0].shipmentAddress.lon, orderArr[0].shipmentAddress.lat ];

            result.vehicles[0] = generateVehicle(1, start, end);
        }

        return result;
    }
}

/**
 * The method generates array with only unique coordinates from the given array.
 * @param {Array.<Array.<number>>} coordinates array with coordinates in the form [lon, lat]
 * @returns {null|Array.<Array.<number>>} array without duplicate coordinates in the form [lon, lat]
 */
const deleteDuplicateCoords = (coordinates) => {
    if(coordinates != null){
        const uniques = [];
        const itemsFound = {};
        for(let i = 0, l = coordinates.length; i < l; i++) {
            const stringified = JSON.stringify(coordinates[i]);
            if(itemsFound[stringified]) { continue; }
            uniques.push(coordinates[i]);
            itemsFound[stringified] = true;
        }
        return uniques;
    }
    return null;
}

/**
 * The method sorts the given array in the order from west to east (left to right on map) and from north to south(top to bottom on map)
 * @param {Array.<Array.<number>>} coordinates array with coordinates in the form [lon, lat]
 * @returns {Array.<Array.<number>>} given array in the sort order
 */
const sortCoordinatesLeftToRight = (coordinates) => {
    if(coordinates != null){
        coordinates.sort(function (a, b){
            if(a[0] === b[0] && a[1] === b[1]){
                return 0;
            } else{
                if(a[0] < b[0]){
                    return -1;
                }else if(a[0] === b[0] && a[1] > b[1]){
                    return -1;
                } else {
                    return 1;
                }
            }
        });
    }
    return coordinates;
}

/**
 * The method generates driving-car type object for the VRoom project.
 * For detailed information see the VRoom project documentation vehicle section
 * @param {number} id id of the vehicle
 * @param {Array.<number>=} start start position in the form [lon, lat], optional parameter
 * @param {Array.<number>=} end end position in the form [lon, lat], optional parameter
 * @returns {{skills: *[], profile: string, id}} driving-car type object for the VRoom project
 */
const generateVehicle = (id, start, end) => {
    const result = {
        id: id,
        profile: "driving-car",
        skills: []
    }

    if(start != null)
        result.start = start;
    if(end != null)
        result.end = end;


    return result;
}

/**
 * The method generates step object for the Vroom project
 * For detailed information see the VRoom project documentation step section
 * @param {number} id id of the step
 * @param {Object} address address ORM object
 * @returns {null|Object} step object for the Vroom project
 */
const generateShipmentStep = (id, address) => {
    let result = null;
    if(address != null){
        result = {};
        const location = [ address.lon, address.lat ];
        result.id = id;
        result.location = location;
    }
    return result;
}