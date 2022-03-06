const express = require('express');
const https = require('https')
const options = {
    hostname: 'https://api.mapbox.com',
    path: '/geocoding/v5/mapbox.places/',
    method: 'GET'
}

const router = express.Router();
const accessToken = 'pk.eyJ1IjoibGVvMTMzNzgiLCJhIjoiY2t1eWFpODdlMG03YzJucXFqYzIzejY2ZiJ9._2n5SN75xLxFTpcNxZFdKQ';
const endpoint = "mapbox.places";

router.get('/test', async (req, res) => {
    let search_text = "Rantatie";
    let url = `https://api.mapbox.com/geocoding/v5/${endpoint}/${search_text}.json?access_token=${accessToken}`
    let json = "LOL";
    https.get(url,(response) => {
        let body = "";

        response.on("data", (chunk) => {
            body += chunk;
        });

        response.on("end", () => {
            try {
                json = JSON.parse(body);
                // do something with JSON
                console.log(json);
                res.send(json);
            } catch (error) {
                console.error(error.message);
            };
        });

    }).on("error", (error) => {
        console.error(error.message);
    });
});

module.exports = router;