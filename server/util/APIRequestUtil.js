class APIRequestUtil {
    /**
     * The method returns default options object for https request to the Open Route Service API.
     * Please, remember to add "Content-Length" field to this object header when trying to post data
     * @type {{path: string, headers: {Authorization: string, Accept: string, "Content-Type": string}, protocol: string, hostname: string, method: string, port: number}}
     */
    getORSSettings(path){
        return {
            protocol: 'https:',
            hostname: 'api.openrouteservice.org',
            port: 443,
            path: path,
            method: 'POST',
            headers: {
                'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
                'Authorization': process.env.ORS_API_KEY,
                'Content-Type': 'application/json',
            }
        };
    }

    /**
     * The method returns default query options object for the Gas Price API (GET request)
     * @returns {{path: string, headers: {authorization: string, "content-type": string}, hostname: string, method: string, port: null}}
     */
    getFuelSettings(){
        return {
            "method": "GET",
            "hostname": "api.collectapi.com",
            "port": null,
            "path": "/gasPrice/europeanCountries",
            "headers": {
                "content-type": "application/json",
                "authorization": "apikey " + process.env.FUEL_API_KEY
            }
        };
    }
}

module.exports = APIRequestUtil;