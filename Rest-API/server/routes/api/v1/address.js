const express = require('express');
const https = require('https');

const router = express.Router();
const accessToken = {
    mapbox : 'pk.eyJ1IjoibGVvMTMzNzgiLCJhIjoiY2t1eWFpODdlMG03YzJucXFqYzIzejY2ZiJ9._2n5SN75xLxFTpcNxZFdKQ',
    openroute : '5b3ce3597851110001cf62484aa58858909f4d949a4d7f231d54a9fe'
};

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
 * e.g: /api/v1/address?search=rantatie
 * trys to show up all rantatie's from finland but limitations from Openrouteservice only shows 40. (There is 226 rantatie's)
 * so we have to specify area little bit more.
 *
 * e.g: /api/v1/address?search=rantatie,tampere
 * shows all rantatie's at tampere area. (max 40)
 */
router.get('/address', async (req, res) => {
    let search_text = req.query.search;
    console.log(search_text);
    //let url = `https://api.mapbox.com/geocoding/v5/${endpoint}/${search_text}.json?country=FI&access_token=${accessToken.mapbox}`
    let url =  `https://api.openrouteservice.org/geocode/search?api_key=${accessToken.openroute}&text=${search_text}&size=500`
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
            street : places.properties.street,
            housenumber : places.properties.housenumber,
            postalcode : places.properties.postalcode,
            county : places.properties.county,
            country : places.properties.country,
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
 * Query parameter search searches from Openrouteservice geocoding api addresses based on
 * the text and predefined country (finland) FI.
 *
 *
 * e.g: /api/v1/address?search=rantatie
 * trys to show up all rantatie's from finland but limitations from Openrouteservice only shows 40. (There is 226 rantatie's)
 * so we have to specify area little bit more.
 *
 * e.g: /api/v1/address?search=rantatie,tampere
 * shows all rantatie's at tampere area. (max 40)
 */
router.get('/address/geojson', async (req, res) => {
    let search_text = req.query.search;
    console.log(search_text);
    //let url = `https://api.mapbox.com/geocoding/v5/${endpoint}/${search_text}.json?country=FI&access_token=${accessToken.mapbox}`
    let url =  `https://api.openrouteservice.org/geocode/search?api_key=${accessToken.openroute}&text=${search_text}&size=500`
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