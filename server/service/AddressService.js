import { validateInput } from "../router/api/v2/routeBuilder/core/service/validateInput.js";
import { ServiceError } from "../router/api/v2/routeBuilder/core/service/dataExtractors/error/ServiceError.js";
import { SEReason } from "../router/api/v2/routeBuilder/core/service/dataExtractors/error/SEReason.js";
import { addressAutocomplete, addressReverse, addressValidate } from "./validation/address.js";
import APILimitTracker from "../util/APILimitTracker.js";


export default class AddressService {
    constructor() {
    }
    
    validate = validateInput(async (address) => {
        try {  
            const areRequests = APILimitTracker.areRequestsLeft('maps', 'search');
            if(!areRequests)
                return new ServiceError({ reason: SEReason.LIMIT_EXCEEDED });

            const {building, street, city} = address;
            const searchText = `${building}+${street}+${city}+Finland`

            const key = process.env.MAPS_API_KEY;
            //const key = '';
            const url = `https://geocode.maps.co/search?q=${searchText}&api_key=${key}`;

            const resp = await makeAPIReq(url);
            if(!resp || resp?.length === 0)
                return new ServiceError({ reason: SEReason.NOT_FOUND, message: 'Could not find any addresses for given query' });
            
            return resp[0];
        } catch (e) {
            console.error(`AddressService validate(): Could not validate the address`, e);
            return new ServiceError({reason: SEReason.UNEXPECTED, additional: e});
        }
    }, addressValidate); 

    reverse = validateInput(async (coordinates) => {
        try {  
            const areRequests = APILimitTracker.areRequestsLeft('maps', 'reverse');
            if(!areRequests)
                return new ServiceError({ reason: SEReason.LIMIT_EXCEEDED });

            const {lon, lat} = coordinates;

            const key = process.env.MAPS_API_KEY;
            //const key = '';
            const url = `https://geocode.maps.co/reverse?lon=${lon}&lat=${lat}&apiKey=${key}`;

            return makeAPIReq(url);
        } catch (e) {
            console.error(`AddressService reverse(): Could not reverse geocode the address`, e);
            return new ServiceError({reason: SEReason.UNEXPECTED, additional: e});
        }
    }, addressReverse); 

    autocomplete = validateInput(async (searchQuery) => {
        try {  
            const areRequests = APILimitTracker.areRequestsLeft('geoapify', 'autocomplete');
            if(!areRequests)
                return new ServiceError({ reason: SEReason.LIMIT_EXCEEDED });

            const {search, city} = searchQuery;

            const cityId = determineGeoapifyCityId(city);
            if(!cityId)
                return new ServiceError({ reason: SEReason.NOT_FOUND, message: `Can not find the ${city} city or it is not supported` });

            //const key = '';
            const key = process.env.GEOAPIFY_API_KEY;
            const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${search}&lang=en&limit=5&type=street&filter=place:${cityId}&format=json&apiKey=${key}`;

            const resp = await makeAPIReq(url);
            if(!resp || !resp?.results || resp.results?.length === 0)
                return new ServiceError({ reason: SEReason.NOT_FOUND, message: 'Could not find any addresses for given query' });

            const { results } = resp;
            const streetNames = [];
            for(let i=0, l=results.length; i<l; i++)
                streetNames.push(results[i]['street']);

            if(streetNames.length === 0)
                return new ServiceError({ reason: SEReason.NOT_FOUND, message: 'Could not find any addresses for given query' });

            return streetNames;
        } catch (e) {
            console.error(`AddressService autocomplete(): Could not autocomplete the address`, e);
            return new ServiceError({reason: SEReason.UNEXPECTED, additional: e});
        }
    }, addressAutocomplete); 
}

async function makeAPIReq(url) {
    try {
        const response = await fetch(url);
        if(!response.ok)
            return new ServiceError({ 
                reason: SEReason.UNEXPECTED, 
                message: `Service responded with status ${response.status}`
            });

        return await response.json();
    } catch (error) {
        return new ServiceError({ 
            reason: SEReason.UNEXPECTED, 
            additional: error
        });
    }
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