import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet'
import { Paper, Typography, useMediaQuery } from '@material-ui/core';
import useStyles from './styles';

import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import Description from "./Description";
import icon from "../constants";


import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";




// class CenterControl extends MapControl {  // note we're extending MapControl from react-leaflet, not Component from react

//     componentWillMount() {
//         const centerControl = L.control({ position: 'bottomright' });  // see http://leafletjs.com/reference.html#control-positions for other positions
//         const jsx = (
//             // PUT YOUR JSX FOR THE COMPONENT HERE:
//             <div {...this.props}>
//         // add your JSX
//             </div>
//         );

//         centerControl.onAdd = function (map) {
//             let div = L.DomUtil.create('div', '');
//             return div;
//         };

//         this.leafletElement = centerControl;
//     }
// }







function Map({ coordinates, setCoordinates, LocationMarker, start, end, LeafletgeoSearchStart, LeafletgeoSearchEnd }) {






    const classes = useStyles();
    const isDesktop = useMediaQuery('(min-width:600px)')









    const RoutingMachine = createControlComponent(() => {
        const instance = L.Routing.control({
            waypoints: [
                L.latLng(start.lat, start.lng),
                L.latLng(end.lat, end.lng),
            ],
            lineOptions: {
                styles: [{ color: "red", weight: 4 }]
            },
        });

        return instance;
    })



    function Calculate() {
        console.log("calculated")
    }





    return (



        <MapContainer
            className={classes.mapContainer}
            // dragging={false}
            center={coordinates}
            setCoordinates={setCoordinates}
            zoom={14}
            scrollWheelZoom={false}
            whenReady={() => {
                console.log("we are ready")
            }}
        >

            <LocationMarker />
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker />
            {/* <Marker position={[60.169, 24.938]}>
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>

            <Marker position={[61.169, 25.938]}>
                <Popup>
                    hello MiKhkail. <br /> Easily customizable.
                </Popup>
            </Marker>

            <Marker position={[61.169, 26.938]}>
                <Popup>
                    hello Leevi. <br /> Easily customizable.
                </Popup>
            </Marker> */}
            <button className={classes.button} onClick={Calculate}>Calculate</button>

            <RoutingMachine />
            <LeafletgeoSearchStart />
            <LeafletgeoSearchEnd />
            {/* <Description
                title={"My Button Title"}
                markerPosition={[20.27, -157]}
                description="This is a custom description!"
            /> */}





        </MapContainer>
    );
}
export default Map