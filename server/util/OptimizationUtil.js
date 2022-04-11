class OptimizationUtil{
    getVROOMRequestObject(coordinates){
        if(coordinates != null){
            const result = {
                jobs: [],
                vehicles:[]
            }

            coordinates = deleteDuplicateCoords(coordinates);
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

                result.vehicles[0] = {
                    "id": 1,
                    "start": coordinates[0],
                    "end": coordinates[coordinates.length-1],
                    "profile": "driving-car",
                    "skills": []
                }

                return result;
            }
            return null;
        }

        return null;
    }

    getOptimizedCoordinates(vroomRes){
        if(vroomRes.routes[0] != null){
            const result = [];
            const steps = vroomRes.routes[0].steps;
            for(let i=0; i < steps.length; i++){
                if(steps[i].type === "job"){
                    result.push(steps[i].location);
                }
            }
            return result;
        }
        return null;
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

module.exports.OptimizationUtil = OptimizationUtil;