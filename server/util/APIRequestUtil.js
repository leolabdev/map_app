class APIRequestUtil {
    /**
     * Returns default options for https request.
     * REMEMBER TO ADD options.headers["Content-Length"] = data.length; when trying to post data
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