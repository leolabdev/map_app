class OptimizationUtil{
    getVROOMRequestObject(coordinates){
        if(coordinates != null){
            const result = {
                jobs: [],
                vehicles:[]
            }

            coordinates = sortCoordinatesLeftToRight(coordinates);

            if(coordinates != null){
                for(let i=0; i < coordinates.length; i++){
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

module.exports.OptimizationUtil = OptimizationUtil;