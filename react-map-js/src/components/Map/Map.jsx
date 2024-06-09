import React, { useState } from "react";
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import useStyles from './styles';
import MyModal from "../UI/Modal/MyModal"
import MyButton from "../UI/button/MyButton";
import L from "leaflet";
import "leaflet-routing-machine";
import ShowRouteForm from "../ShowRouteForm/ShowRouteForm";
import getMarkerIcon from "../../shared/helpers/getMarkerIcon";
import secToHours from "../../shared/helpers/secToHours";

function Map({
    setAllowPositionMarker,
    setOurShipmentAddress,
    setOurDeliveryAddress,
    ourShipmentAddress,
    ourShipmentAddresses,
    ourDeliveryAddress,
    ourDeliveryAddresses,
    coordinates,
    setCoordinates,
    LocationMarker,
    ourStart,
    ourEnd,
    setOurStart,
    setOurEnd,
    ordersIdForRoutes,
    modal,
    setModal,
}) {

    const [fuelUsage, setFuelUsage] = useState(5.7);
    let [routeData, setRouteData] = useState({});

    let geojsonLayer;
    let map;
    const layerGroup = L.layerGroup();

    function addRoute(geoJSON) {
        setAllowPositionMarker(false)
        map.eachLayer(function (layer) {
            if (layer._url == null) {
                map.removeLayer(layer)
            }
        });
        map.removeLayer(geojsonLayer);
        geojsonLayer = L.geoJSON(geoJSON);
        geojsonLayer.addTo(map);
    }

    // add order marker to the map function 
    function addOrderMarker(lat, lon, popUp, markerType) {
        let markerColor;
        let markerIcon;
        // depends on a marker type we choose the marker color
        if (markerType === "Manufacturer") markerColor = "orange"; else if (markerType === "Client") markerColor = "blue"; else if (markerType === "Start") markerColor = "green"; else if (markerType === "End") markerColor = "red"; else markerColor = "black";

        markerIcon = getMarkerIcon(markerColor);

        let latlon = L.latLng([lat, lon]);
        let orderMarker = new L.marker(latlon, { icon: markerIcon });
        orderMarker.bindPopup(popUp).openPopup();
        orderMarker.addTo(map);
    }

    // by this we get access to using html DOM's map 
    function MyMap() {
        map = useMap();
        geojsonLayer = L.geoJSON();
        geojsonLayer.addTo(map);
        layerGroup.addTo(map);
        return null
    }

    const classes = useStyles();


    return (
        <MapContainer
            className={classes.mapContainer}
            // dragging={false}
            center={coordinates}
            setCoordinates={setCoordinates}
            zoom={14}
            minZoom={7}
            scrollWheelZoom={false}
            whenReady={() => {
                console.log("map is loaded")
            }}
        >

            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <LocationMarker />

            <div className={classes.showRouteButton}>
                <MyButton
                    onClick={() => setModal(true)}
                >
                    Show Route
                </MyButton>
            </div>
            {/* The map summary output  */}
            <div className={classes.summaryOutput}>
                {routeData !== null ? (<>
                    <div><b>Distance: </b>{(routeData?.distance / 1000)?.toFixed(2)} <i>kms</i></div>
                    <div><b>Duration: </b> {secToHours((routeData?.duration))}  </div>
                    <div><b>Fuel usage: </b>{(routeData?.fuelusage)?.toFixed(2)} <i>litres</i></div>
                    <div><b><i>CO<sub>2</sub> emission</i>: </b>{(routeData?.co2)?.toFixed(2)}  </div>
                    <div><b>Route Cost:</b> dis: {(routeData?.routeCost?.diesel)}€,
                        gas: {routeData?.routeCost?.gasoline}€
                    </div>
                </>) : (<div>No data</div>)}
            </div>
            <MyModal visible={modal} setVisible={setModal}>
                <ShowRouteForm

                    ourStart={ourStart}
                    setOurStart={setOurStart}
                    ourEnd={ourEnd}
                    setOurEnd={setOurEnd}

                    fuelUsage={fuelUsage}
                    setFuelUsage={setFuelUsage}
                    setRouteData={setRouteData}

                    ourShipmentAddress={ourShipmentAddress}
                    setOurShipmentAddress={setOurShipmentAddress}
                    ourDeliveryAddress={ourDeliveryAddress}
                    setOurDeliveryAddress={setOurDeliveryAddress}
                    ourShipmentAddresses={ourShipmentAddresses}
                    ourDeliveryAddresses={ourDeliveryAddresses}

                    ordersIdForRoutes={ordersIdForRoutes}
                    addRoute={addRoute}
                    addOrderMarker={addOrderMarker}
                    setAllowPositionMarker={setAllowPositionMarker}
                    setVisible={setModal}

                />
            </MyModal>

            <MyMap />

        </MapContainer>);
}

export default Map