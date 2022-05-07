import React, { useState, useEffect, useRef } from "react";
import { CssBaseline} from '@material-ui/core'
//import logo from './logo.svg';
// import '.././App.css';
// import Navbar from "../components/Navbar/Navbar";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet'

import Map from "../components/Map/Map";
import List from "../components/List/List";
import "leaflet-geosearch/dist/geosearch.css";
import L from "leaflet";

// import mapData from "./data/customgeo.json"
// import mapData3 from "./data/customgeo3.json"
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
// import icon from ".././src/components/constants"
import icon  from "../components/constants"







function MapPage() {




  const [modal, setModal] = useState(false);

  // const [coordinates, setCoordinates] = useState({ lat: 60.1699, lng: 24.9384 });
  const [coordinates, setCoordinates] = useState({ lat: 60.1699, lon: 24.9384 });

  // const [start, setStart] = useState({ lat: 60.98267, lng: 25.66151 });
  const [start, setStart] = useState({ lat: 60.98267, lon: 25.66151 });
  // const [end, setEnd] = useState({ lat: 60.1699, lng: 24.9384 })
  const [end, setEnd] = useState({ lat: 60.1699, lon: 24.9384 })
  let [orderPoints, setOrderPoints] = useState([]);
  let [ordersIdForRoutes, setOrdersIdForRoutes] = useState([]);
  





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
          // map.flyTo(e.latlng, map.getZoom());
        }

      },
    })

    return position === null ? null : (
      <Marker position={position}>
        <Popup>You are here</Popup>
      </Marker>
    )
  }


  // const createHuman = (newHuman) => {
  //   postNewHuman(newHuman)
  // }


  // // get post from children element
  // const removeHuman = (human) => {

  // }




  return (
    <div className='App'>
     
      {/* <input value={value1} onChange={event => setValue1(event.target.value)} /> */}

      {/* <input value={value2} onChange={event => setValue2(event.target.value)} /> */}

      {/* <button onClick={() => setResult(Number(value1) + Number(value2))}>btn</button> */}
      {/* <input type="text" /> */}
      {/* <p>result: {result}</p> */}
      {/* <span>Where are you ?</span>  <Droplist /> <br /> */}
      {/* <span>Where we go ?</span> <Droplist1 /> */}
      <Map
        // ref={mapRef}
        modal={modal}
        setModal={setModal}
        start={start}
        setStart={setStart}
        setEnd={setEnd}
        end={end}
        coordinates={coordinates}
        setCoordinates={setCoordinates}
        LocationMarker={LocationMarker}
        // LeafletgeoSearchStart={LeafletgeoSearchStart}
        // LeafletgeoSearchEnd={LeafletgeoSearchEnd}
        orderPoints={orderPoints}
        setOrderPoints={setOrderPoints}
        ordersIdForRoutes={ordersIdForRoutes}
        setOrdersIdForRoutes={setOrdersIdForRoutes}


      />
      <div className="list">
        <List
          modal={modal}
          setModal={setModal}
          start={start}
          setStart={setStart}
          end={end}
          setEnd={setEnd}
          orderPoints={orderPoints}
          setOrderPoints={setOrderPoints}
          ordersIdForRoutes={ordersIdForRoutes}
          setOrdersIdForRoutes={setOrdersIdForRoutes}
          
        // createHuman={createHuman}
        // humans={humans}
        // isLoading={isLoading}
        // setIsLoading={setIsLoading}
        // humansType={humansType}
        // setHumansType={setHumansType}
        // getHumansData={getHumansData}
        />
      </div>


    </div>
  );
}

export default MapPage;