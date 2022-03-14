// import React, { Component } from "react";
// import { useMap } from "react-leaflet";
// import L, { LeafletMouseEvent, Map } from "leaflet";




// class Description extends React.Component {

//     map

//     addRoute(geoJSON) {
//         map.removeLayer(geojsonLayer);
//         geojsonLayer = L.geoJSON(geoJSON);
//         geojsonLayer.addTo(map);
//     }

//     helpDiv;


//     createButtonControl() {
//         const MapHelp = L.Control.extend({
//             onAdd: (map) => {
//                 const helpDiv = L.DomUtil.create("button", "");
//                 this.helpDiv = helpDiv;
//                 helpDiv.innerHTML = this.props.title;

//                 helpDiv.addEventListener("click", (ev) => {
//                     console.log(map.getCenter());
//                     geojsonLayer = L.geoJSON();

//                     const marker = L.marker()
//                         .setLatLng(this.props.markerPosition)
//                         .bindPopup(this.props.description)
//                         .addTo(map);

//                     marker.openPopup();

//                     // let data = {
//                     //     coordinates: [
//                     //         [60.181576782061356, 24.939455637162748],
//                     //         [65.181576782061356, 24.939455637162748],
//                     //     ]
//                     // }
//                     // fetch('http://localhost:8081/api/v1/routing', {
//                     //     method: 'POST', // or 'PUT'
//                     //     headers: {
//                     //         'Content-Type': 'application/json',
//                     //     },
//                     //     body: JSON.stringify(data),
//                     // })
//                     //     .then(response => response.json())
//                     //     .then(data => {
//                     //         console.log('Success:', data);
//                     //         addRoute(data);

//                     //     })
//                     //     .catch((error) => {
//                     //         console.error('Error:', error);
//                     //     });
//                 }
//                 );

//                 //a bit clueless how to add a click event listener to this button and then
//                 // open a popup div on the map
//                 return helpDiv;
//             }
//         });
//         return new MapHelp({ position: "topleft" });
//     }

//     componentDidMount() {
//         const { map } = this.props;
//         const control = this.createButtonControl();
//         control.addTo(map);
//         const control1 = this.createButtonControl();
//         control1.addTo(map);
//     }

//     addRoute(geoJSON, map) {
//         map.removeLayer(geojsonLayer);
//         geojsonLayer = L.geoJSON(geoJSON);
//         geojsonLayer.addTo(map);
//     }

//     componentWillUnmount() {
//         this.helpDiv.remove();
//     }

//     render() {
//         return null;
//     }
// }

// function withMap(Component) {
//     return function WrappedComponent(props) {
//         const map = useMap();
//         return <Component {...props} map={map} />;
//     };
// }

// export default withMap(Description);