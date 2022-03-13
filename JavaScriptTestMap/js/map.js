'use strict';

// Kartan aloituksen keskipiste
const lat = 60.181576782061356;
const lng = 24.939455637162748;

let geojsonLayer = L.geoJSON();

let map;
let startButton = document.getElementById("start_input");
let endButton = document.getElementById("end_input");

let startLabel = document.getElementById("start");
let endLabel = document.getElementById("end");

let calculateButton = document.getElementById("calculate");

let startClicked = false;
let endClicked = false;

let startlatlng;
let endlatlng;
let endMarker =  L.marker();
let startMarker =  L.marker();

startButton.onclick = (ev)=> {
    startClicked = true;
    endClicked = false;
};
endButton.onclick =(ev)=> {
    endClicked = true;
    startClicked = false;
};
calculateButton.onclick = (ev)=>{
    let data = {
        coordinates : [
            [startlatlng.lng, startlatlng.lat],
            [endlatlng.lng, endlatlng.lat],
        ]
    }
    fetch('http://localhost:8081/api/v1/routing', {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            addRoute(data);

        })
        .catch((error) => {
            console.error('Error:', error);
        });
}
createMap();
let leftSidebar = L.control.sidebar('sidebar-left', {
    position: 'left',
    closeButton : false
});
let rightSidebar = L.control.sidebar('sidebar-right', {
    position: 'right'
});
map.addControl(leftSidebar);
map.addControl(rightSidebar);
leftSidebar.show();

map.on('click', (e) => {
    if(startClicked){
        startLabel.innerHTML = e.latlng;
        startlatlng = e.latlng;
        startClicked = false;
        map.removeLayer(startMarker);
        startMarker = new L.marker(e.latlng).addTo(map);
    }
    if(endClicked){
        endLabel.innerHTML = e.latlng;
        endlatlng = e.latlng;
        endClicked = false;
        map.removeLayer(endMarker);
        endMarker = new L.marker(e.latlng).addTo(map);
    }
    console.log(e.latlng.lat);
    console.log(e.latlng.lng);
});

function createMap(){
    map = L.map('map',{
        worldCopyJump: true,
        minZoom : 5
    }).setView([lat, lng], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
}

function addRoute(geoJSON){
    map.removeLayer(geojsonLayer);
    geojsonLayer = L.geoJSON(geoJSON);
    geojsonLayer.addTo(map);
}