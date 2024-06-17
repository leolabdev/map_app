import express from "express";
import ThrottlingQueue from "../../../../util/throttlingQueue.js";
import APILimitTracker from "../../../../util/APILimitTracker.js";
import validate from "../routeBuilder/core/pipelineHandlers/validate.js";
import { addressReverse } from "../routeBuilder/rules/validation/address.js";
import { catchErrors } from "../routeBuilder/core/pipelineHandlers/catchErrors.js";
import { addReqLimit } from "../routeBuilder/core/pipelineHandlers/addReqLimit..js";
import { formatResponse } from "../routeBuilder/core/pipelineHandlers/formatResponse.js";


const router = express.Router();

const validateQueue = new ThrottlingQueue(1500);
router.get('/validate', async (req, res, next) => {
    const areRequests = APILimitTracker.areRequestsLeft('maps', 'search');
    if(!areRequests)
        return sendDailyLimitExceeded(res);

    const {street, building, city} = req.query;
    const searchText = `${building}+${street}+${city}+Finland`

    const key = process.env.MAPS_API_KEY;
    const url = `https://geocode.maps.co/search?q=${searchText}&api_key=${key}`;

    const requestFunction = apiRequestFunction(url, res);
    validateQueue.addRequest(requestFunction)
});

const reverseQueue = new ThrottlingQueue(1500);
router.get('/reverse', validate(addressReverse, 'query'), async (req, res, next) => {
    const areRequests = APILimitTracker.areRequestsLeft('maps', 'reverse');
    if(!areRequests)
        return sendDailyLimitExceeded(res);

    const {lon, lat} = req.query;

    //60.2078669, 24.8918027
    const key =  process.env.GEOAPIFY_API_KEY;
    const url = `https://geocode.maps.co/reverse?lon=${lon}&lat=${lat}&apiKey=${key}`;

    const requestFunction = apiRequestFunction(url, res);
    reverseQueue.addRequest(requestFunction);
}, catchErrors(), formatResponse());


const autocompleteQueue = new ThrottlingQueue(1500);
router.get('/autocomplete', addReqLimit(3000), async (req, res, next) => {
    const areRequests = APILimitTracker.areRequestsLeft('geoapify', 'autocomplete');
    if(!areRequests)
        return sendDailyLimitExceeded(res);

    const {search, city} = req.query;

    const cityId = determineGeoapifyCityId(city);
    if(!cityId){
        res.status(400).send({error: 'City is not supported, it can be Helsinki, Vantaa, Espoo, Lahti, Tampere or Turku'});
        return;
    }

    const key = process.env.GEOAPIFY_API_KEY;
    const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${search}&lang=en&limit=5&type=street&filter=place:${cityId}&format=json&apiKey=${key}`;

    const requestFunction = apiRequestFunction(url, res);
    autocompleteQueue.addRequest(requestFunction);
});


function apiRequestFunction(url, res) {
    return async () => {
        try {
            const response = await fetch(url);
            if (!response.ok)
                throw new Error(`Request failed with status: ${response.status}`);

            const data = await response.json();
            res.status(200).send(data);
        } catch (error) {
            console.error(error);
            res.status(500).send({error: 'Failed to fetch geocoding data'});
        }
    }
}

function sendDailyLimitExceeded(res) {
    res.status(429).send({error: 'Daily limit exceeded'});
}

/**
 *
 * @param {'Helsinki' | 'Vantaa' | 'Espoo' | 'Lahti' | 'Tampere' | 'Turku'} city
 */
function determineGeoapifyCityId(city) {
    switch (city) {
        case "Helsinki":
            return '516ee415e357f13840590efc034070154e40f00101f9016288000000000000c00208';
        case "Vantaa":
            return '51062571fb8a0a39405950ceab9564254e40f00101f9016888000000000000c00208';
        case "Espoo":
            return '51161747e526a838405991a5c5cf351a4e40f00101f901018d000000000000c00208';
        case "Lahti":
            return '51a258b8f64fa93940597d00f7e1c57d4e40f00101f9012d47050000000000c00208';
        case "Tampere":
            return '514dc34bcba3c2374059a4da4c2abfbf4e40f00101f9018b9e360000000000c00208';
        case "Turku":
            return '51295371885d44364059ed2eab0bd3394e40f00101f901221a060000000000c00208';
        default:
            return null;
    }
}

export default router;