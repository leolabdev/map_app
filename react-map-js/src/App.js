import React, { useState, useEffect, useRef } from "react";
import { CssBaseline, Grid } from '@material-ui/core'
//import logo from './logo.svg';
import './App.css';
import Header from "./components/Header/Header";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet'
//import List from "./components/List/List";
import Map from "./components/Map/Map";
import Droplist from './droplist'
import Droplist1 from './droplist1'
import "leaflet-geosearch/dist/geosearch.css";
import L from "leaflet";

// import mapData from "./data/customgeo.json"
// import mapData3 from "./data/customgeo3.json"

import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import icon from "../src/components/constants"



function App() {

  // const mapRef = useRef();

  // useEffect(() => {
  //   const map = mapRef.current
  //   console.log(map)
  // }, []);

  const [long, setLong] = useState(null);
  const [lat, setLat] = useState(null);


  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");
  const [result, setResult] = useState(0);


  // const [coordinates, setCoordinates] = useState({ lat: 60.1699, lng: 24.9384 });
  const [coordinates, setCoordinates] = useState({ lat: 60.1699, lon: 24.9384 });

  // const [start, setStart] = useState({ lat: 60.98267, lng: 25.66151 });
  const [start, setStart] = useState({ lat: 60.98267, lon: 25.66151 });
  // const [end, setEnd] = useState({ lat: 60.1699, lng: 24.9384 })
  const [end, setEnd] = useState({ lat: 60.1699, lon: 24.9384 })

  let [currentLocation, setCurrentLocation] = useState()




  // [60.169, 24.938]

  // get user position 
  // useEffect(() => {
  //   navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
  //     setCoordinates({ lat: latitude, lng: longitude });
  //     console.log(latitude, longitude)
  //   });
  // }, []);



  // function LeafletgeoSearch() {


  //   const map = useMap();
  //   useEffect(() => {
  //     const provider = new OpenStreetMapProvider();

  //     const searchControl = new GeoSearchControl({

  //       provider,
  //       marker: {
  //         icon

  //       },
  //     });
  //     map.addControl(searchControl);



  //     // console.log("h", searchControl.provider)
  //     return () => map.removeControl(searchControl);
  //   }, []);

  //   return null;
  // }



  function LeafletgeoSearchStart() {


    const map = useMap();
    useEffect(() => {
      const provider = new OpenStreetMapProvider();

      const searchControl = new GeoSearchControl({

        provider,
        marker: {
          icon

        },
      });
      map.addControl(searchControl);
      function searchEventHandler(result) {
        setStart(result.location.x, result.location.y)
        // console.log(start);
      }

      map.on('geosearch/showlocation', searchEventHandler);


      // console.log("h", searchControl.provider)
      return () => map.removeControl(searchControl);
    }, []);

    return null;

  }

  function LeafletgeoSearchEnd() {


    const map = useMap();
    useEffect(() => {
      const provider = new OpenStreetMapProvider();

      const searchControl = new GeoSearchControl({

        provider,
        // marker: {
        //   icon

        // },
      });
      map.addControl(searchControl);

      function searchEventHandler(result) {
        setEnd(result.location.x, result.location.y)
        // console.log(end);
      }

      map.on('geosearch/showlocation', searchEventHandler);


      // console.log("h", searchControl.provider)
      return () => map.removeControl(searchControl);
    }, []);

    return null;
  }





  function LocationMarker() {
    const [position, setPosition] = useState(null)
    var executed = false;

    const map = useMapEvents({

      mouseover() {
        // console.log(useMapEvents)
        map.locate()
      },

      locationfound(e) {
        if (!executed) {
          executed = true;
          setPosition(e.latlng);
          map.flyTo(e.latlng, map.getZoom());
        }

      },
    })

    return position === null ? null : (
      <Marker position={position}>
        <Popup>You are here</Popup>
      </Marker>
    )
  }

  // function LocationMarker2({ }) {
  //   const map = useMapEvents('load', (e) => {
  //     map.flyTo(e.latlng, map.getZoom())
  //   })

  //   return null
  // }




  return (
    <div className='App'>
      <CssBaseline />
      <Header />
      <input value={value1} onChange={event => setValue1(event.target.value)} />

      <input value={value2} onChange={event => setValue2(event.target.value)} />

      <button onClick={() => setResult(Number(value1) + Number(value2))}>btn</button>
      <input type="text" />
      <p>result: {result}</p>
      <span>Where are you ?</span>  <Droplist /> <br />
      <span>Where we go ?</span> <Droplist1 />
      <Map
        // ref={mapRef}
        start={start}
        end={end}
        coordinates={coordinates}
        setCoordinates={setCoordinates}
        LocationMarker={LocationMarker}
        LeafletgeoSearchStart={LeafletgeoSearchStart}
        LeafletgeoSearchEnd={LeafletgeoSearchEnd}


      />
    </div>
  );
}

export default App;

