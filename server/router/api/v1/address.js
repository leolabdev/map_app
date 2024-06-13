import express from "express";
import * as https from "https";


const router = express.Router();

/**
 * Middleware to limit address query request
 * least 3 characters in text parameter
 */
router.use('/address', (req, res, next) => {
    if(req.path === '/geocode')
        return next();

    try{
        const searchText = req.query.text;
        if(!searchText || searchText.length < 3) {
            res.status(400);
            res.send({
                status: 400,
                search: searchText,
                desc: "search parameter is not valid! Should contain at least 3 characters",
            });
            return;
        }
    }catch (e) {
        console.log('/address error', e);
    }
    next();
});

/**
 * Query parameter search searches from Openrouteservice geocoding api addresses based on
 * the text and predefined country (finland) FI.
 *
 *
 * e.g: /api/v1/address/search?text=rantatie
 * trys to show up all rantatie's from finland but limitations from Openrouteservice only shows 40. (There is 226 rantatie's)
 * so we have to specify area little bit more.
 *
 * e.g: /api/v1/address?/search?text=rantatie,tampere
 * shows all rantatie's at tampere area. (max 40)
 */
router.get('/address/search', async (req, res, next) => {
    const key = process.env.ORS_API_KEY;
    const searchText = req.query.text;
    const url = `https://api.openrouteservice.org/geocode/search?api_key=${key}&text=${encodeURIComponent(searchText)}&size=500&boundary.country=FI`;

    const resp = await makeORSRequest(url, parseAddressFromORS);

    if(resp === null){
        res.status(500).send("An error occurred while fetching the address information.");
        next();
        return;
    }

    res.send(resp);
});

/**
 *
 * Autocomplete gives Json out where there is 25 different places.
 * Query parameter search searches from Openrouteservice geocoding autocomplete api based on
 * the text and predefined country (finland) FI.
 *
 * Limitations: shows only when 3 or more characters are typed into search parameter, max 25 places
 *
 * e.g:
 * input: /api/v1/address/autocomplete?text=ranta
 * trys to show up all ranta places from finland, current max is 25 because there is no need for more
 * normally in e.g. google maps there is like 5 places to shown user.
 *
 * output:
 * [
 *  {
 *    "name": "Rantasalmi",
 *    "county": "Savonlinna",
 *    "country": "Finland",
 *    "macroregion": "Eastern Finland",
 *    "region": "Southern Savonia",
 *    "label": "Rantasalmi, Finland",
 *    "coordinates": {
 *    "lat": 28.30421,
 *    "lon": 62.063429
 *   }
 *  },
 *  ....
 * ]
 */
router.get('/address/autocomplete', async (req, res, next) => {
    const searchText = req.query.text;

    const key = process.env.ORS_API_KEY;
    const url = `https://api.openrouteservice.org/geocode/autocomplete?api_key=${key}&text=${encodeURIComponent(searchText)}&size=25&boundary.country=FI`;

    const resp = await makeORSRequest(url, parseAddressFromORS);

    if(resp === null){
        res.status(500).send("An error occurred while fetching the autocomplete information.");
        next();
        return;
    }

    res.send(resp);
});

/**
 * Query parameter search searches from Openrouteservice geocoding api addresses based on
 * the text and predefined country (finland) FI.
 *
 *
 * e.g: /api/v1/address/geojson?text=rantatie
 * trys to show up all rantatie's from finland but limitations from Openrouteservice only shows 40. (There is 226 rantatie's)
 * so we have to specify area little bit more.
 *
 * e.g: /api/v1/address/geojsontext=rantatie,tampere
 * shows all rantatie's at tampere area. (max 40)
 */
router.get('/address/geojson', async (req, res, next) => {
    const searchText = req.query.text;

    const key = process.env.ORS_API_KEY;
    const url = `https://api.openrouteservice.org/geocode/search?api_key=${key}&text=${encodeURIComponent(searchText)}&size=500&boundary.country=FI`;

    const resp = await makeORSRequest(url, parseGeoJsonFromORS);

    if(resp === null){
        res.status(500).send("An error occurred while fetching the geolocation information.");
        next();
        return;
    }

    res.send(resp);
});

/**
 * Get reverse geocode response from the ORS(open route service), i.e. street address by geographical coordinates(lon, lat)
 * Example url: http://localhost:8081/api/v1?lon=24.456&lat=65.3456
 */
router.get('/address/geocode', async (req, res, next) => {
    const {lon, lat} = req.query;

    const key = process.env.ORS_API_KEY;
    const url = `https://api.openrouteservice.org/geocode/reverse?api_key=${key}&point.lon=${lon}&point.lat=${lat}`;

    const resp = await makeORSRequest(url, parseReverseGeocode);

    if(resp === null){
        res.status(500).send("An error occurred while fetching the reverse geocode information.");
        next();
        return;
    }

    res.send(resp);

    try {
        const response = await fetch(url);
        if (!response.ok)
            // If the response status indicates an error, throw an error
            throw new Error(`Failed to fetch from OpenRouteService: ${response.statusText}`);

        const json = await response.json();
        const reqResult = json.features;
        if (reqResult != null && reqResult.length > 0) {
            const resp = parseReverseGeocode(reqResult[0]);
            res.send(resp);
        } else {
            res.send(null);
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send("An error occurred while fetching the reverse geocode information.");
    }
});


/**
 * @param {string} url url to fetch
 * @param {(Object) => any} parser function to parse ORS response
 * @returns {Promise<any|null>}
 */
async function makeORSRequest(url, parser) {
    try {
        const response = await fetch(url);
        if (!response.ok)
            return null;

        const resp = await response.json();
        return parser(resp);
    } catch (error) {
        console.error(error.message);
    }

    return null;
}

/**
 * Converts openrouteservices GeoJson to our own GeoJson.
 *
 * Most important information is street, housenumber, postalcode, county and country,
 * any of these can be undefined or null.
 *
 * @param geojson to convert
 * @returns {{features: [{geometry: *, type, properties: {country: *, housenumber: *, street: *, postalcode: *, county: *}}], type: string}}
 */
function parseGeoJsonFromORS(geojson) {
    let features = geojson.features;
    let GeoJson = {
        type : "FeatureCollection",
        features : [],
    };

    features.forEach(places => {
        GeoJson.features.push({
            type : places.type,
            geometry : places.geometry,
            properties : {
                street : places.properties.street,
                housenumber : places.properties.housenumber,
                postalcode : places.properties.postalcode,
                county : places.properties.county,
                country : places.properties.country,
            },
        });
    });
    return GeoJson;
}

/**
 * The method converts ORS(open route service) reverse geocoding response to the address object
 * @param {Array} placeData response data from the ORS
 * @returns {{streetAddress: string, city: string, coordinates: Array.<number>, type: string} | null}
 */
function parseReverseGeocode(placeData) {
    const data = placeData[0];
    if(!data)
        return null;

    const place = data.properties;
    const streetAddress = place.name;
    const city = place.county;
    const coordinates = data.geometry.coordinates;

    return {
        type: "address",
        streetAddress: streetAddress,
        city: city,
        coordinates: coordinates
    }
}

/**
 * Converts openrouteservices GeoJson to our own Json Data object.
 *
 * Most important information is street, housenumber, postalcode, county, country and coordinates
 * any of these can be undefined or null.
 *
 * @param geojson to convert
 * @returns {[{country: *, housenumber: *, street: *, postalcode: *, county: *, geometry: *}]}
 */
function parseAddressFromORS(geojson) {
    let features = geojson.features;
    let json = [];
    features.forEach(places => {
        json.push({
            name : places.properties.name,
            street : places.properties.street,
            housenumber : places.properties.housenumber,
            postalcode : places.properties.postalcode,
            county : places.properties.county,
            country : places.properties.country,
            macroregion : places.properties.macroregion,
            region : places.properties.region,
            label : places.properties.label,
            coordinates : {
                lon : places.geometry.coordinates[0],
                lat : places.geometry.coordinates[1],
            },
        });
    });
    return json;
}

export default router;