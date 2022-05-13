const axios = require("axios");

class SettingsUtil {
    async setUp(){
        await addCityCenters();
    }
}
module.exports = SettingsUtil;

async function addCityCenters() {
    await axios.post(`http://localhost:8081/dao/area`, HelsinkiCenter);
}

//Helsinki center coordinates in Polygon form
const HelsinkiCenter = {
    "areaName": "HelsinkiCenter",
    "type": "Polygon",
    "coordinates": [
        [
            [24.92188453674316,60.1720009743249],
            [24.924287796020508,60.16260738958614],
            [24.930896759033203,60.1623511632902],
            [24.93475914001465,60.158123140977864],
            [24.956903457641598,60.16021586646705],
            [24.95510101318359,60.16896970183465],
            [24.92188453674316,60.1720009743249]
        ]
    ]
}