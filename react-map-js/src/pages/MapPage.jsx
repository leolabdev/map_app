import React, {useState, useEffect, useRef} from "react";
import {CssBaseline} from '@material-ui/core'
import {MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap} from 'react-leaflet'
import Map from "../components/Map/Map";
import List from "../components/List/List";
import "leaflet-geosearch/dist/geosearch.css";
import L from "leaflet";

function MapPage() {

    const [modal, setModal] = useState(false);

    const [coordinates, setCoordinates] = useState({lat: 60.1699, lon: 24.9384});

    let [ourStart, setOurStart] = useState(null);
    let [ourEnd, setOurEnd] = useState(null);

    let [orderPoints, setOrderPoints] = useState([]);
    let [ordersIdForRoutes, setOrdersIdForRoutes] = useState([]);
    let [ordersAddresses, setOrdersAddresses] = useState([]);
    let [ordersAddressesFlag, setOrdersAddressesFlag] = useState(false);

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


    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            setCurrentPosition(prevState => ({
                    ...prevState, lat: position.coords.latitude, lon: position.coords.longitude
                })
            )
        })
    }, [])


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
                    console.log(currentPositionMarker)
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
                allowPositionMarker={allowPositionMarker}
                setAllowPositionMarker={setAllowPositionMarker}
                modal={modal}
                setModal={setModal}
                ourStart={ourStart}
                setOurStart={setOurStart}
                ourEnd={ourEnd}
                setOurEnd={setOurEnd}
                coordinates={coordinates}
                setCoordinates={setCoordinates}
                LocationMarker={LocationMarker}
                orderPoints={orderPoints}
                setOrderPoints={setOrderPoints}
                ordersIdForRoutes={ordersIdForRoutes}
                setOrdersIdForRoutes={setOrdersIdForRoutes}
                ordersAddresses={ordersAddresses}
                setOrdersAddresses={setOrdersAddresses}

                ordersAddressesFlag={ordersAddressesFlag}
                setOrdersAddressesFlag={setOrdersAddressesFlag}
                ourShipmentAddress={ourShipmentAddress}
                ourShipmentAddresses={ourShipmentAddresses}
                ourDeliveryAddress={ourDeliveryAddress}
                ourDeliveryAddresses={ourDeliveryAddresses}

                setOurShipmentAddress={setOurShipmentAddress}
                setOurShipmentAddresses={setOurShipmentAddresses}
                setOurDeliveryAddress={setOurDeliveryAddress}
                setOurDeliveryAddresses={setOurDeliveryAddresses}
            />


            <div className="list">
                <List
                    currentPosition={currentPosition}
                    modal={modal}
                    setModal={setModal}
                    ourStart={ourStart}
                    setOurStart={setOurStart}
                    ourEnd={ourEnd}
                    setOurEnd={setOurEnd}
                    orderPoints={orderPoints}
                    setOrderPoints={setOrderPoints}
                    ordersIdForRoutes={ordersIdForRoutes}
                    setOrdersIdForRoutes={setOrdersIdForRoutes}
                    ordersAddresses={ordersAddresses}
                    setOrdersAddresses={setOrdersAddresses}

                    ourShipmentAddress={ourShipmentAddress}
                    ourShipmentAddresses={ourShipmentAddresses}
                    ourDeliveryAddress={ourDeliveryAddress}
                    ourDeliveryAddresses={ourDeliveryAddresses}

                    setOurShipmentAddress={setOurShipmentAddress}
                    setOurShipmentAddresses={setOurShipmentAddresses}
                    setOurDeliveryAddress={setOurDeliveryAddress}
                    setOurDeliveryAddresses={setOurDeliveryAddresses}

                />
            </div>

        </div>
    );
}

export default MapPage;