const mapSection = document.querySelector("#mapSection");
const mapDiv = mapSection.querySelector("#map");

const map = L.map('map').setView([60.169, 24.938], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

L.Routing.control({
    waypoints: [
        L.latLng(60.169, 24.938),
        L.latLng(60.9827, 25.6612),
        L.latLng(62.242, 25.747)
    ]
}).addTo(map);

