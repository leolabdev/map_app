import React, { useState, useEffect, useRef, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap, GeoJSON, LayersControl } from 'react-leaflet'
import { Paper, Typography, useMediaQuery } from '@material-ui/core';
import useStyles from './styles';

import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import Description from "./Description";
import icon from "../constants";

import mapData from "../../data/customgeo.json"
import mapData3 from "../../data/customgeo3.json"

import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";
import MyButton from "../../UI/button/MyButton";



// class CenterControl extends MapControl {  // note we're extending MapControl from react-leaflet, not Component from react

//     componentWillMount() {
//         const centerControl = L.control({ position: 'bottomright' });  // see http://leafletjs.com/reference.html#control-positions for other positions
//         const jsx = (
//             // PUT YOUR JSX FOR THE COMPONENT HERE:
//             <div {...this.props}>
//         // add your JSX
//             </div>
//         );

//         centerControl.onAdd = function (map) {
//             let div = L.DomUtil.create('div', '');
//             return div;
//         };

//         this.leafletElement = centerControl;
//     }
// }







function Map({ coordinates, setCoordinates, LocationMarker, start, end, LeafletgeoSearchStart, LeafletgeoSearchEnd }) {

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







    // function MyCalculate() {
    //     const map = useMapEvents({
    //         click: () => {
    //             map.removeLayer(geojsonLayer)
    //         },
    //         // locationfound: (location) => {
    //         //     console.log('location found:', location)
    //         // },
    //     })
    //     return (
    //         <MyButton>Calculate</MyButton>
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
    function removeStartMarker() {
        map.removeLayer(startMarker)
    }
    function removeEndMarker() {
        map.removeLayer(endMarker)
    }

    function addEndMarker(lat, lon) {
        // console.log(lat, lon)
        map.removeLayer(endMarker)
        let latlon = L.latLng([lat, lon]);
        endMarker = new L.marker(latlon)
        endMarker.addTo(map)
    }


    function MyComponent() {
        map = useMap()
        // console.log('map center:', map.getCenter())
        geojsonLayer = L.geoJSON();
        // L.geoJSON(mapData).addTo(map)
        geojsonLayer.addTo(map)
        return null
    }

    function ShowrouteButton() {
        return (
            <MyButton onClick={showRoute}>Show Route</MyButton>
        )
    }

    function showRoute() {
        // map = useMap()
        let coordinatesData = {
            coordinates: [
                // [start.lng, start.lat],
                [start.lon, start.lat],
                // [end.lng, end.lat],
                [end.lon, end.lat],
            ]
        }
        console.log(coordinatesData)
        fetch('http://localhost:8081/api/v1/routing', {
            method: 'POST', // or 'PUT'
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(coordinatesData),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                addRoute(data);
                removeStartMarker();
                removeEndMarker();
                addStartMarker(coordinatesData.coordinates[0][1], coordinatesData.coordinates[0][0]);
                addEndMarker(coordinatesData.coordinates[1][1], coordinatesData.coordinates[1][0]);
            })
            .catch((error) => {
                console.error('Error:', error);
            });

        return (
            null
        )
    }

    // function MyCalculate() {
    //     map = useMapEvents({
    //         click:
    //             () => {

    //                 let coordinatesData = {
    //                     coordinates: [
    //                         // [start.lng, start.lat],
    //                         [start.lon, start.lat],
    //                         // [end.lng, end.lat],
    //                         [end.lon, end.lat],
    //                     ]
    //                 }

    //                 console.log(coordinatesData)
    //                 fetch('http://localhost:8081/api/v1/routing', {
    //                     method: 'POST', // or 'PUT'
    //                     headers: {
    //                         'Content-Type': 'application/json',
    //                     },
    //                     body: JSON.stringify(coordinatesData),
    //                 })
    //                     .then(response => response.json())
    //                     .then(data => {
    //                         console.log('Success:', data);
    //                         addRoute(data);
    //                         removeStartMarker();
    //                         removeEndMarker();
    //                         addStartMarker(coordinatesData.coordinates[0][1], coordinatesData.coordinates[0][0]);
    //                         addEndMarker(coordinatesData.coordinates[1][1], coordinatesData.coordinates[1][0]);
    //                     })
    //                     .catch((error) => {
    //                         console.error('Error:', error);
    //                     });
    //             },
    //         // locationfound: (location) => {
    //         //     console.log('location found:', location)
    //         // },
    //     })
    //     return (
    //         <MyButton>Show Route</MyButton>
    //     )
    // }






    const classes = useStyles();
    const isDesktop = useMediaQuery('(min-width:600px)')



    var [geo, setGeo] = useState("")




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
            <LeafletgeoSearchStart />
            <LeafletgeoSearchEnd />
            {/* <Description
                title={"My Button Title"}
                markerPosition={[20.27, -157]}
                description="This is a custom description!"
            /> */}
            <MyComponent />





        </MapContainer>
    );
}
export default Map