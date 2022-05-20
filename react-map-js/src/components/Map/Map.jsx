import React, { useState, useEffect, useRef, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap, GeoJSON, LayersControl } from 'react-leaflet'
import { Paper, Typography, useMediaQuery } from '@material-ui/core';
import useStyles from './styles';

import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import icon from "../constants";

import MyModal from "../UI/Modal/MyModal"

import MyButton from "../UI/button/MyButton";

import L from "leaflet";
import "leaflet-routing-machine";
import ShowRouteForm from "../ShowRouteForm/ShowRouteForm";
import secToHours from "../../functions/secToHours";
import getMarkerIcon from "../../functions/getMarkerIcon";


function Map({setAllowPositionMarker,currentPosition,setOurShipmentAddress,setOurShipmentAddresses,setOurDeliveryAddress,setOurDeliveryAddresses, ourShipmentAddress, ourShipmentAddresses, ourDeliveryAddress,ourDeliveryAddresses,ordersAddresses, setOrdersAddresses, coordinates, setCoordinates, LocationMarker, ourStart, ourEnd,setOurStart, setOurEnd, LeafletgeoSearchStart, LeafletgeoSearchEnd ,orderPoints,setOrderPoints,  ordersIdForRoutes,setOrdersIdForRoutes,modal,setModal, ordersAddressesFlag,setOrdersAddressesFlag}) {

    const [fuelUsage, setFuelUsage] = useState(5.7);
    let [routeData,setRouteData] = useState({});

    let geojsonLayer;
    let map;
    // var latlng;
    let startMarker = new L.marker();
    const endMarker = new L.marker();

    const layerGroup = L.layerGroup();

    const [status, setStatus] = useState(false);

    function addRoute(geoJSON) {
        setAllowPositionMarker(false)
        map.eachLayer(function (layer) {
            if (layer._url == null){
                map.removeLayer(layer)
            }
          });
        map.removeLayer(geojsonLayer);
        geojsonLayer = L.geoJSON(geoJSON);
        geojsonLayer.addTo(map);
    }

    function addStartMarker(lat, lon) {
        // map.removeLayer(startMarker)
        // console.log(lat, lon)
        // map.removeLayer(startMarker)
        // let latlon = L.latLng([23.7610, 61.4978]);
        let latlon = L.latLng([lat, lon]);
        startMarker = new L.marker(latlon)
        startMarker.addTo(map)
    }


    // add order marker to the map function 
    function addOrderMarker(lat,lon,popUp,markerType){
        let markerColor;
        let markerIcon;
        // depends on a marker type we choose the marker color
        if(markerType==="Manufacturer") markerColor="orange";
        else if(markerType==="Client") markerColor="blue";
        else if(markerType==="Start") markerColor="green";
        else if(markerType==="End") markerColor="red";
        else markerColor="black";

        markerIcon = getMarkerIcon(markerColor);

        let latlon = L.latLng([lat, lon]);
        let orderMarker = new L.marker(latlon,{icon : markerIcon});
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
            onClick={()=>setModal(true)}
            >
            Show Route
            </MyButton>
            </div>
            {/* The map summary output  */}
            <div className={classes.summaryOutput}>
                 {routeData !== null ?
                 (          <>
                           <div> <b>Distance: </b>{(routeData?.distance/1000)?.toFixed(2)} <i>kms</i> </div>
                           <div><b>Duration: </b> {secToHours((routeData?.duration))}  </div>
                           <div><b>Fuel usage: </b>{(routeData?.fuelusage)?.toFixed(2)} <i>litres</i> </div>
                           <div><b><i>CO<sub>2</sub>e</i>: </b>{(routeData?.co2)?.toFixed(2)}  </div>
                           <div><b>Route Cost:</b> dis: {(routeData?.routeCost?.diesel)}€, gas: {routeData?.routeCost?.gasoline}€</div>
                           </>
                        )
                    :(<div>No data</div>)
                    }
            </div>
            <MyModal visible={modal} setVisible={setModal}>
            <ShowRouteForm
            setAllowPositionMarker={setAllowPositionMarker}

            ourStart={ourStart}
            setOurStart={setOurStart}
            ourEnd={ourEnd}
            setOurEnd={setOurEnd}
            fuelUsage={fuelUsage}
            setFuelUsage={setFuelUsage}
            setRouteData={setRouteData}
            routeData={routeData}

            ordersIdForRoutes={ordersIdForRoutes}
            addRoute={addRoute}
            addOrderMarker={addOrderMarker}

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

            setVisible={setModal}
            />
            </MyModal>

            <MyMap />

        </MapContainer>
    );
}
export default Map