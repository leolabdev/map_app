const express = require('express');
const https = require('https');

const router = express.Router();

const clients = []
/**
 * Middleware to limit address query request
 * least 3 characters in text parameter
 */
router.use('/address', (req, res, next) => {
    console.log(req);

    let search_text = req.query.text;
    if(search_text.length < 3) {
        res.status(400);
        res.send({
            status: 400,
            search: search_text,
            desc: "search parameter not valid! Should contain at least 3 characters",
        });
        return;
    }
    next();
});
/**
 * Converts openrouteservices GeoJson to our own GeoJson.
 *
 * Most important information is street, housenumber, postalcode, county and country,
 * any of these can be undefined or null.
 *
 * @param geojson to convert
 * @returns {{features: [{geometry: *, type, properties: {country: *, housenumber: *, street: *, postalcode: *, county: *}}], type: string}}
 */
function parseGeoJsonFromORS(geojson){
    let features = geojson.features;
    let GeoJson = {
        type : "FeatureCollection",
        features : [

        ],
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
router.get('/address/search', async (req, res) => {
    let search_text = req.query.text;
    console.log(search_text);
    //let url = `https://api.mapbox.com/geocoding/v5/${endpoint}/${search_text}.json?country=FI&access_token=${accessToken.mapbox}`
    let url =  `https://api.openrouteservice.org/geocode/search?api_key=${process.env.ORS_API_KEY}&text=${search_text}&size=500&boundary.country=FI`
    console.log(url);
    let json;
    await https.get(url,(response) => {
        let body = "";

        response.on("data", (chunk) => {
            body += chunk;
        });

        response.on("end", () => {
            try {
                json = JSON.parse(body);
                // do something with JSON
                res.send(parseAddressFromORS(json));
            } catch (error) {
                console.error(error.message);
            };
        });

    }).on("error", (error) => {
        console.error(error.message);
    });
});

/**
 * Converts openrouteservices GeoJson to our own Json Data object.
 *
 * Most important information is street, housenumber, postalcode, county, country and coordinates
 * any of these can be undefined or null.
 *
 * @param geojson to convert
 * @returns {[{country: *, housenumber: *, street: *, postalcode: *, county: *, geometry: *}]}
 */
function parseAddressFromORS(geojson){
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
                lat : places.geometry.coordinates[0],
                lon : places.geometry.coordinates[1],
            },
        });
    });
    console.log(json);
    return json;
}

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
router.get('/address/autocomplete', async (req, res) => {
    let search_text = req.query.text;
    console.log(search_text);
    //let url = `https://api.mapbox.com/geocoding/v5/${endpoint}/${search_text}.json?country=FI&access_token=${accessToken.mapbox}`
    let url =  `https://api.openrouteservice.org/geocode/autocomplete?api_key=${process.env.ORS_API_KEY}&text=${search_text}&size=25&boundary.country=FI`
    console.log(url);
    let json;
    await https.get(url,(response) => {
        let body = "";

        response.on("data", (chunk) => {
            body += chunk;
        });

        response.on("end", () => {
            try {
                json = JSON.parse(body);
                // do something with JSON
                res.send(parseAddressFromORS(json));
            } catch (error) {
                console.error(error.message);
            };
        });

    }).on("error", (error) => {
        console.error(error.message);
    });
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
router.get('/address/geojson', async (req, res) => {
    let search_text = req.query.text;
    console.log(search_text);
    //let url = `https://api.mapbox.com/geocoding/v5/${endpoint}/${search_text}.json?country=FI&access_token=${accessToken.mapbox}`
    let url =  `https://api.openrouteservice.org/geocode/search?api_key=${process.env.ORS_API_KEY}&text=${search_text}&size=500&boundary.country=FI`
    console.log(url);
    let json;
    await https.get(url,(response) => {
        let body = "";

        response.on("data", (chunk) => {
            body += chunk;
        });

        response.on("end", () => {
            try {
                json = JSON.parse(body);
                // do something with JSON
                res.send(parseGeoJsonFromORS(json));
            } catch (error) {
                console.error(error.message);
            };
        });

    }).on("error", (error) => {
        console.error(error.message);
    });
});

module.exports = router;