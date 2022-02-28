const mapSection = document.querySelector("#mapSection");
const mapDiv = mapSection.querySelector("#map");

const map = L.map('map').setView([60.169, 24.938], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    maxZoom: 18,
}).addTo(map);


