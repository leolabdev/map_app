import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet'
import { Paper, Typography, useMediaQuery } from '@material-ui/core';
import useStyles from './styles';

import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";


import icon from "../constants";






function Map({ coordinates, setCoordinates, LocationMarker }) {





    function LeafletgeoSearch() {
        const map = useMap();
        useEffect(() => {
            const provider = new OpenStreetMapProvider();
            const searchControl = new GeoSearchControl({
                provider,
                marker: {
                    icon

                }
            });
            map.addControl(searchControl);
            console.log(map)
            return () => map.removeControl(searchControl);
        }, []);

        return null;
    }


    const classes = useStyles();
    const isDesktop = useMediaQuery('(min-width:600px)')




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
            <Marker position={[60.169, 24.938]}>
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
            </Marker>

            <LeafletgeoSearch />
            <LeafletgeoSearch />





        </MapContainer>
    );
}
export default Map