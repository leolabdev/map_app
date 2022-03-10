import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import { Paper, Typography, useMediaQuery } from '@material-ui/core';
import useStyles from './styles';










function Map({ coordinates, setCoordinates, LocationMarker }) {









    const classes = useStyles();
    const isDesktop = useMediaQuery('(min-width:600px)')








    return (



        <MapContainer
            className={classes.mapContainer}
            center={coordinates}
            setCoordinates={setCoordinates}
            zoom={14}
            scrollWheelZoom={false}

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






        </MapContainer>
    );
}
export default Map