import React, { useState, useEffect } from "react";
import { Marker, Popup, useMapEvents } from 'react-leaflet'
import Map from "../components/Map/Map";
import List from "../components/List/List";
import "leaflet-geosearch/dist/geosearch.css";



function MapPage() {

    const [modal, setModal] = useState(false);

    const [coordinates, setCoordinates] = useState({ lat: 60.1699, lon: 24.9384 });

    let [ourStart, setOurStart] = useState(null);
    let [ourEnd, setOurEnd] = useState(null);


    let [ordersIdForRoutes, setOrdersIdForRoutes] = useState([]);
    let [ordersAddresses, setOrdersAddresses] = useState([]);

    const [ourShipmentAddress, setOurShipmentAddress] = useState(null);
    const [ourDeliveryAddress, setOurDeliveryAddress] = useState(null);
    const [ourShipmentAddresses, setOurShipmentAddresses] = useState([]);
    const [ourDeliveryAddresses, setOurDeliveryAddresses] = useState([]);


    let [currentPosition, setCurrentPosition] = useState({
        name: "Current Position",
        type: "position",
        lat: null,
        lon: null
    })
    let [currentPositionMarker, setCurrentPositionMarker] = useState(null)
    let [allowPositionMarker, setAllowPositionMarker] = useState(true)


    // here we get current position from the navigator
    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            setCurrentPosition(prevState => ({
                ...prevState, lat: position.coords.latitude, lon: position.coords.longitude
            })
            )
        })
    }, [])

    // allow us to display the current position on the map
    function LocationMarker() {

        let executed = false;

        const map = useMapEvents({
            load() {
                console.log("Loading")
            },
            mouseover() {
                map.locate()
            },

            locationfound(e) {
                if (!executed && allowPositionMarker === true) {
                    executed = true;
                    setCurrentPositionMarker(e.latlng);
                    // map.flyTo(e.latlng, map.getZoom());
                }

            },
        })

        return currentPositionMarker === null ? null : (
            <Marker position={currentPositionMarker}>
                <Popup>You are here</Popup>
            </Marker>
        )
    }

    return (
        <div className='App'>
            <Map
                setAllowPositionMarker={setAllowPositionMarker}
                setOurShipmentAddress={setOurShipmentAddress}
                setOurDeliveryAddress={setOurDeliveryAddress}
                ourShipmentAddress={ourShipmentAddress}
                ourShipmentAddresses={ourShipmentAddresses}
                ourDeliveryAddress={ourDeliveryAddress}
                ourDeliveryAddresses={ourDeliveryAddresses}
                coordinates={coordinates}
                setCoordinates={setCoordinates}
                LocationMarker={LocationMarker}
                ourStart={ourStart}
                ourEnd={ourEnd}
                setOurStart={setOurStart}
                setOurEnd={setOurEnd}
                ordersIdForRoutes={ordersIdForRoutes}
                modal={modal}
                setModal={setModal}
            />

            <div className="list">
                <List
                    currentPosition={currentPosition}
                    setOurShipmentAddresses={setOurShipmentAddresses}
                    setOurDeliveryAddresses={setOurDeliveryAddresses}
                    ordersAddresses={ordersAddresses}
                    setOrdersAddresses={setOrdersAddresses}
                    setOrdersIdForRoutes={setOrdersIdForRoutes}
                    modal={modal}
                    setModal={setModal}
                />
            </div>

        </div>
    );
}

export default MapPage;