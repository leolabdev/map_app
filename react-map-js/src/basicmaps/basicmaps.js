import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import './basicmaps.css'


function BasicMaps() {
    return (
        <MapContainer center={[60.169, 24.938]} zoom={8} scrollWheelZoom={false}   >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
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
export default BasicMaps