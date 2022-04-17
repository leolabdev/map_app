import React, { useState, useEffect, useRef, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap, GeoJSON, LayersControl } from 'react-leaflet'
import { Paper, Typography, useMediaQuery } from '@material-ui/core';
import useStyles from './styles';

import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import icon from "../constants";



import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";
import MyButton from "../../UI/button/MyButton";

const icon1 = L.icon({
    iconSize: [25, 41],
    iconAnchor: [10, 41],
    popupAnchor: [2, -40],
    iconUrl: 'https://unpkg.com/leaflet@1.6/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.6/dist/images/marker-shadow.png'
});






function Map({ coordinates, setCoordinates, LocationMarker, start, end, LeafletgeoSearchStart, LeafletgeoSearchEnd ,orderPoints,setOrderPoints,  ordersIdForRoutes,setOrdersIdForRoutes}) {

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

    function addOrderMarker(lat,lon){
        let latlon = L.latLng([lat, lon]);
        let orderMarker = new L.marker(latlon)
        orderMarker.addTo(map)
    }

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


    // by this we get access to using html DOM's map 
    function MyMap() {
        map = useMap()
        // console.log('map center:', map.getCenter())
        geojsonLayer = L.geoJSON();
        // L.geoJSON(mapData).addTo(map)
        geojsonLayer.addTo(map)

        layerGroup.addTo(map)

        // addEndMarker(60.4518, 22.2666)
        return null
    }



    function ShowrouteButton() {
        return (
            <MyButton onClick={showRoute} >Show Route</MyButton>
        )
    }

    function showRoute() {
        // map = useMap()
        console.log(orderPoints)

        console.log("orders id in  map request", ordersIdForRoutes)

        let sendOrdersIdForRoutesData={
            orderIds: [
                ...ordersIdForRoutes
            ],
            fuelusage: 5.7
        }

        // let coordinatesData = {
        //     coordinates: [
        //         ...orderPoints
        //         // [start.lng, start.lat],
        //         // [start.lon, start.lat],
        //         // // [end.lng, end.lat],
        //         // [end.lon, end.lat],
        //     ]
        // }
        // console.log(coordinatesData)
        console.log(sendOrdersIdForRoutesData)
        if (sendOrdersIdForRoutesData.orderIds.length !== 0) {
            fetch('http://localhost:8081/api/v1/routing/orders', {
                method: 'POST', // or 'PUT'
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(sendOrdersIdForRoutesData),
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Success:', data);
                    addRoute(data);
                    // removeStartMarker();
                    // removeEndMarker();
                    // coordinatesData.coordinates.map((c)=>addOrderMarker(c[1],c[0]))
                    console.log(data.features[0].properties.summary.orders[2])
                    data.features[0].properties.summary.orders[2].forEach(
                        (o)=>{
                            addOrderMarker(o.deliveryAddress.lat,o.deliveryAddress.lon)
                            addOrderMarker(o.shipmentAddress.lat,o.shipmentAddress.lon)
                            console.log(o.orderId)
                        }
                    )
                    // data.coordinates.map((c)=>addOrderMarker(c[1],c[0]))
    
                    // addStartMarker(coordinatesData.coordinates[0][1], coordinatesData.coordinates[0][0]);
                    // addEndMarker(coordinatesData.coordinates[1][1], coordinatesData.coordinates[1][0]);
                })  
                .catch((error) => {
                    console.error('Error:', error);
                });
    
            return (
                null
            )
        }
        else{
            alert("plz select a order/orders")
            return (null)
        }
    }

        
       




    const classes = useStyles();
    const isDesktop = useMediaQuery('(min-width:600px)')



    // var [geo, setGeo] = useState("")




    // const RoutingMachine = createControlComponent(() => {
    //     const instance = L.Routing.control({
    //         waypoints: [
    //             L.latLng(start.lat, start.lng),
    //             L.latLng(end.lat, end.lng),
    //         ],
    //         lineOptions: {
    //             styles: [{ color: "red", weight: 4 }]
    //         },
    //     });

    //     return instance;
    // })

    // const RoutingMachine = createControlComponent(mapData3)








    return (



        <MapContainer

            // ref={mapRef}
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
            <ShowrouteButton />
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