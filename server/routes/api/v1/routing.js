const express = require('express');
const https = require('https');

const router = express.Router();

let options = {
    protocol: 'https:',
    hostname: 'api.openrouteservice.org',
    port: 443,
    path: '/v2/directions/driving-car/geojson',
    method: 'POST',
    headers: {
        'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
        'Authorization': '5b3ce3597851110001cf62484aa58858909f4d949a4d7f231d54a9fe',
        'Content-Type': 'application/json',
    }
};

router.post('/routing/test', async (req, res) => {
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