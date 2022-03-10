import React, { useState, useEffect } from "react";
import { CssBaseline, Grid } from '@material-ui/core'
//import logo from './logo.svg';
import './App.css';
import Header from "./components/Header/Header";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
//import List from "./components/List/List";
import Map from "./components/Map/Map";
import Droplist from './droplist'
import Droplist1 from './droplist1'

function App() {

  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");
  const [result, setResult] = useState(0);


  const [coordinates, setCoordinates] = useState({ lat: 60.1699, lng: 24.9384 });
  // [60.169, 24.938]

  // get user position 
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
      setCoordinates({ lat: latitude, lng: longitude });
      console.log(latitude, longitude)
    });
  }, []);


  function LocationMarker() {
    const [position, setPosition] = useState(null)
    const map = useMapEvents({

      mouseover() {
        console.log(useMapEvents)
        map.locate()
      },

      locationfound(e) {

        setPosition(e.latlng)
        map.flyTo(e.latlng, map.getZoom())
      },
    })

    return position === null ? null : (
      <Marker position={position}>
        <Popup>You are here</Popup>
      </Marker>
    )
  }



  return (
    <div className='App'>
      <CssBaseline />
      <Header />
      <input value={value1} onChange={event => setValue1(event.target.value)} />

      <input value={value2} onChange={event => setValue2(event.target.value)} />

      <button onClick={() => setResult(Number(value1) + Number(value2))}>btn</button>

      <p>result: {result}</p>
      <span>Where are you ?</span>  <Droplist /> <br />
      <span>Where we go ?</span> <Droplist1 />
      <Map
        coordinates={coordinates}
        setCoordinates={setCoordinates}
        LocationMarker={LocationMarker}



      />
    </div>
  );
}

export default App;

