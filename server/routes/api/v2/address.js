import express from "express";


const router = express.Router();

//TODO: throttling for every endpoint, maps.co 1s, geoapifi 2-3s/IP

router.get('/validate', async (req, res, next) => {
    const {street, building, city} = req.query;
    const searchText = `${building}+${street}+${city}+Finland`

    const key = process.env.MAPS_API_KEY;
    const url = `https://geocode.maps.co/search?q=${searchText}&api_key=${key}`;

    const response = await fetch(url);
    const data = await response.json();

    res.status(200).send(data);
});

router.get('/reverse', async (req, res, next) => {
    const {lon, lat} = req.query;

    //60.2078669, 24.8918027
    const key = process.env.MAPS_API_KEY;
    const url = `https://geocode.maps.co/reverse?lon=${lon}&lat=${lat}&api_key=${key}`;

    const response = await fetch(url);
    const data = await response.json();

    res.status(200).send(data);
});

router.get('/autocomplete', async (req, res, next) => {
    const {search, city} = req.query;

    const helsinkiPlaceId = '516ee415e357f13840590efc034070154e40f00101f9016288000000000000c00208';
    const vantaaPlaceId = '51062571fb8a0a39405950ceab9564254e40f00101f9016888000000000000c00208';
    const espooPlaceId = '51161747e526a838405991a5c5cf351a4e40f00101f901018d000000000000c00208';

    const lahtiPlaceId = '51a258b8f64fa93940597d00f7e1c57d4e40f00101f9012d47050000000000c00208';
    const tamperePlaceId = '514dc34bcba3c2374059a4da4c2abfbf4e40f00101f9018b9e360000000000c00208';
    const turkuPlaceId = '51295371885d44364059ed2eab0bd3394e40f00101f901221a060000000000c00208';

    const key = process.env.ORS_API_KEY;
    const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${search}&lang=en&limit=5&type=street&filter=place:${lahtiPlaceId}&format=json&apiKey=${key}`;

    const response = await fetch(url);
    const data = await response.json();

    res.status(200).send(data);
});


export default router;