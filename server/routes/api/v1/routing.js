const express = require('express');
const https = require('https');

const router = express.Router();

/**
 * Default options for https request.
 * REMEMBER TO ADD options.headers["Content-Length"] = data.length; when trying to post data
 * @type {{path: string, headers: {Authorization: string, Accept: string, "Content-Type": string}, protocol: string, hostname: string, method: string, port: number}}
 */
let options = {
    protocol: 'https:',
    hostname: 'api.openrouteservice.org',
    port: 443,
    path: '/v2/directions/driving-car/geojson',
    method: 'POST',
    headers: {
        'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
        'Authorization': process.env.ORS_API_KEY,
        'Content-Type': 'application/json',
    }
};
/**
 * Sends api query to openrouteservice to calculate route. Uses openrouteservices directions service.
 *
 * responses back geoJSON
 */
router.post('/routing', async (req, res) => {
    let coordinates = req.body.coordinates;
    console.log(coordinates);
    let data = JSON.stringify({
        coordinates:coordinates,
        alternative_routes:{
            share_factor:0.6,
            target_count:3,
            weight_factor:2
        },
        continue_straight:true,
        instructions:true,
        units:"m"
    });
    options.headers["Content-Length"] = data.length;

    const request = await https.request(options, (response) => {
        let data = '';

        response.on('data', (chunk) => {
            data += chunk;
        });

        response.on('end', () => {
            console.log(JSON.parse(data));
            res.send(JSON.parse(data));
        });

    }).on("error", (err) => {
        console.log("Error: ", err.message);
    });

    request.write(data);
    request.end();
});

module.exports = router;