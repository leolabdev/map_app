const express = require('express');
const https = require('https');

const router = express.Router();
const accessToken = {
    mapbox : 'pk.eyJ1IjoibGVvMTMzNzgiLCJhIjoiY2t1eWFpODdlMG03YzJucXFqYzIzejY2ZiJ9._2n5SN75xLxFTpcNxZFdKQ',
    openroute : '5b3ce3597851110001cf62484aa58858909f4d949a4d7f231d54a9fe'
};
const endpoint = "mapbox.places";

/**
 * Converts openrouteservices json to our own array json object. From openrouteservices json we use features as main source
 * then features properties for information
 *
 * Most important information is street, housenumber, postalcode, county and country,
 * any of these can be undefined or null.
 *
 * @param json to convert
 * @returns {[{country: *, housenumber: *, street: *, postalcode: *, county: *}]}
 */
function parseAddressFromORS(json){
    let features = json.features;
    let dataJSON = [];
    features.forEach(places => {
        dataJSON.push({
            street : places.properties.street,
            housenumber : places.properties.housenumber,
            postalcode : places.properties.postalcode,
            county : places.properties.county,
            country : places.properties.country
        });
    });
    return dataJSON;
}

/**
 * Openrouteservice only allows 40 addresses! In finland there is 226 Rantatie streets and 40 is maxinium to search
 */
router.get('/address', async (req, res) => {
    let search_text = req.query.search;
    console.log(search_text);
    //let url = `https://api.mapbox.com/geocoding/v5/${endpoint}/${search_text}.json?country=FI&access_token=${accessToken.mapbox}`
    let url =  `https://api.openrouteservice.org/geocode/search?api_key=${accessToken.openroute}&text=${search_text}&boundary.country=FI&layers=address&size=500`
    let json;
    https.get(url,(response) => {
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

module.exports = router;