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








function Map({ordersAddresses, setOrdersAddresses, coordinates, setCoordinates, LocationMarker, ourStart, ourEnd,setOurStart, setOurEnd, LeafletgeoSearchStart, LeafletgeoSearchEnd ,orderPoints,setOrderPoints,  ordersIdForRoutes,setOrdersIdForRoutes,modal,setModal, ordersAddressesFlag,setOrdersAddressesFlag}) {

    
    const [fuelUsage, setFuelUsage] = useState(5.7);
    let [routeData,setRouteData] = useState({});

 

    useEffect(() => {

        console.log("heeeere", ourStart, ourEnd)


    }, [
        ourStart, ourEnd

    ]);




    var geojsonLayer;
    var map;
    // var latlng;
    var startMarker = new L.marker();
    var endMarker = new L.marker();

    const layerGroup = L.layerGroup();

    const [status, setStatus] = useState(false)
    
    
    function addRoute(geoJSON) {
        map.eachLayer(function (layer) {
            // layer._url == null  ?  map.removeLayer(layer) ;
            
            if (layer._url == null){
                map.removeLayer(layer)
            }
            // console.log(layer._url)
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



 

    function addOrderMarker(lat,lon,popUp,markerType){
        let markerColor;
        let markerIcon;
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
        map = useMap()
        // console.log('map center:', map.getCenter())
        geojsonLayer = L.geoJSON();
     
        geojsonLayer.addTo(map)

        layerGroup.addTo(map)

       
        return null
    }


    const classes = useStyles();
    const isDesktop = useMediaQuery('(min-width:600px)')
    

    return (



        <MapContainer

            // ref={mapRef}
            className={classes.mapContainer}
            // dragging={false}
            center={coordinates}
            setCoordinates={setCoordinates}
            zoom={14}
            minZoom={7}
            scrollWheelZoom={false}
            whenReady={() => {
                console.log("we are ready")
            }}
        >

            {/* <LocationMarker /> */}
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
            {/* <button onClick={showRoute} >Show Route</button> */}
            {/* // console.log(routeData.features[0].properties.summary); */}
            <div className={classes.summaryOutput}>
                 {/* {routeData} */}
                 {routeData !== null ?  
                 (          <>
                           <div> <b>Distance: </b>{(routeData?.distance/1000)?.toFixed(2)} <i>kms</i> </div>
                           <div><b>Duration: </b> {secToHours((routeData?.duration))}  </div>
                           <div><b>Fuel usage: </b>{(routeData?.fuelusage)?.toFixed(2)} <i>litres</i> </div>
                           <div><b><i>CO<sub>2</sub>e</i>: </b>{(routeData?.co2)?.toFixed(2)}  </div>
                           </>
                        //    <div>{routeData.distance}</div>
                        //    <div>{routeData.distance}</div>
                        )
                    :(<div>hello</div>)
                    }
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
            routeData={routeData}

            ordersIdForRoutes={ordersIdForRoutes}
            addRoute={addRoute}
            addOrderMarker={addOrderMarker}

            ordersAddresses={ordersAddresses}
            setOrdersAddresses={setOrdersAddresses}

            ordersAddressesFlag={ordersAddressesFlag}
            setOrdersAddressesFlag={setOrdersAddressesFlag}

            setVisible={setModal}
            />
            </MyModal>

          
            <MyMap />

         





        </MapContainer>
    );
}
export default Map