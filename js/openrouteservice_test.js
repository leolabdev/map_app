//ORS access key
key = "5b3ce3597851110001cf62484aa58858909f4d949a4d7f231d54a9fe";

window.addEventListener("load", (evt) => getTwoPointDirection([60.2265482, 24.816782], [60.2259408, 24.8119744], 1))

const request = new XMLHttpRequest();

//start, end -arrays(double) with points coords (lat,lon), mode(int) - vehicle type(now only 1(=car) available)
function getTwoPointDirection(start, end, mode) {
    let startPointDir = null;
    let endPointDir = null;
    let profile = null;
    if(!isNaN(start[0]) && !isNaN(start[1])){
        startPointDir = start[0] + "," + start[1];
    }
    if(!isNaN(end[0]) && !isNaN(end[1])){
        endPointDir = end[0] + "," + end[1];
    }

    if(mode === 1){
        profile = "driving-car";
    }

    if(startPointDir && endPointDir && profile){
        const query = "api_key=" + key + "&start=" + startPointDir + "&end=" + endPointDir;
        const url = "https://api.openrouteservice.org/v2/directions/" + profile + "?" + query;

        request.open("GET", url);
        request.onreadystatechange = () => {
            if(this.readyState === 4){
                console.log("Status: " + this.statusCode);
                console.log("Body: " + this.responseText);
                return this.responseText;
            }
        }
        request.send();
    } else{
        console.error("Could not make request");
        return null;
    }
}