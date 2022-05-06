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








function Map({ coordinates, setCoordinates, LocationMarker, start, end,setStart, setEnd, LeafletgeoSearchStart, LeafletgeoSearchEnd ,orderPoints,setOrderPoints,  ordersIdForRoutes,setOrdersIdForRoutes,modal,setModal}) {

    // const map = useMap();const [orderPoints, setOrderPoints] = useState([]);
    // const map = useMap();
    // function name(params) {
    //     const map = useMap();    

    //     useEffect(() => {

    //         console.log(map)
    //     }, []);
    //     return null;
    // }

    // function GeoL() {


    //     const map = useMap();
    //     useEffect(() => {

    //         const searchControl = mapData

    //         map.addControl(searchControl);

    //         // function searchEventHandler(result) {
    //         //     // setStart(result.location.x, result.location.y)
    //         //     console.log(start);
    //         // }

    //         // map.on('geosearch/showlocation', searchEventHandler);


    //         // console.log("h", searchControl.provider)
    //         return () => map.removeControl(searchControl);
    //     }, []);

    //     return null;

    // }

    // function LocationMarkers() {
    //     const initialMarkers = [new L.LatLng(51.505, -0.09)];
    //     const [markers, setMarkers] = useState(initialMarkers);

    //     const map = useMapEvents({
    //         click(e) {
    //             markers.push(e.latlng);
    //             setMarkers((prevValue) => [...prevValue, e.latlng]);
    //         }
    //     });

    //     return (
    //         <React.Fragment>
    //             {markers.map(marker => <Marker position={marker} ></Marker>)}
    //         </React.Fragment>
    //     );
    // }



   // const [modal, setModal] = useState(false);
    const [fuelUsage, setFuelUsage] = useState(5.7);
    let [routeData,setRouteData] = useState({});

 

    useEffect(() => {

        console.log("heeeere", start, end)


    }, [
        start, end

    ]);




    var geojsonLayer;
    var map;
    // var latlng;
    var startMarker = new L.marker();
    var endMarker = new L.marker();

    const layerGroup = L.layerGroup();

    const [status, setStatus] = useState(false)




    // const LayerGroupcomponent = () => {

    //     const map1 = useMap();
    //     let [printInfo, setPrintinfo] = useState('');

    //     useEffect(() => {



    //         function hello() {

    //             layerGroup.clearLayers();
    //             // let latlng = e.geocode.center;
    //             let latlon = L.latLng([23.7610, 61.4978]);
    //             L.marker(latlon, { icon1 })
    //                 .bindPopup("e.geocode.name")
    //                 .openPopup()
    //                 .addTo(layerGroup);

    //             // map1.panTo(latlng);

    //             setPrintinfo("e.geocode.name");
    //             map1.addLayer(layerGroup)
    //                 .addTo(map1);
    //         }
    //         hello()

    //     }, [map1]);
    //     return (
    //         null
    //     )
    // }
    
    

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



    // function addEndMarker(lat, lon) {
    //     let latlon = L.latLng([lat, lon]);
    //     // let latlon = L.latLng([22.2666, 60.4518]);
    //     endMarker = new L.marker(latlon)
    //     endMarker.addTo(map)
    // }
    // const testarray = [];
    // const hello = "hello";
    // // hello.addTo(testarray)
    // console.log(testarray)

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
            {/* <LocationMarkers /> */}

            {/* <GeoL /> */}


            {/* <Marker position={[60.169, 24.938]}>
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker> */}
            {/*
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
            {/* <button className={classes.button} onClick={Calculate}>Calculate</button> */}
            {/* <MyButton className={classes.button} onClick={Calculate}> Calculate</MyButton> */}
            {/* <MyCalculate></MyCalculate> */}

    
            {/* <MyButton style={{ marginTop: '20px' }} onClick={() => setModal(true)}>
             Create User
             </MyButton> */}

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
            start={start}
            setStart={setStart}
            end={end}
            setEnd={setEnd}
            fuelUsage={fuelUsage}
            setFuelUsage={setFuelUsage}
            setRouteData={setRouteData}
            routeData={routeData}

            ordersIdForRoutes={ordersIdForRoutes}
            addRoute={addRoute}
            addOrderMarker={addOrderMarker}

            setVisible={setModal}
            />
            </MyModal>

            {/* <ShowRouteForm
            ordersIdForRoutes={ordersIdForRoutes}
            addRoute={addRoute}
            addOrderMarker={addOrderMarker}
            /> */}

            {/* <ShowrouteButton /> */}
            {/* <RoutingMachine /> */}
            {/* <LeafletgeoSearchStart /> */}
            {/* <LeafletgeoSearchEnd /> */}
            {/* <Description
                title={"My Button Title"}
                markerPosition={[20.27, -157]}
                description="This is a custom description!"
            /> */}
            <MyMap />

            {/* <LayerGroupcomponent /> */}





        </MapContainer>
    );
}
export default Map