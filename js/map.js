const mapSection = document.querySelector("#mapSection");
const mapDiv = mapSection.querySelector("#map");

const map = L.map('map').setView([51.505, -0.09], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

L.Routing.control({
    waypoints: [
        L.latLng(51.505, -0.09),
        L.latLng(52.505, -0.09),
        L.latLng(53.505, -3)
    ]
}).addTo(map);