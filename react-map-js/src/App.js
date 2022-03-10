import React, { useState } from 'react';
import { CssBaseline, Grid } from '@material-ui/core'
//import logo from './logo.svg';
import './App.css';
import BasicMaps from './basicmaps/basicmaps';
import Header from "./components/Header/Header";
//import List from "./components/List/List";
import Map from "./components/Map/Map";
import Droplist from './droplist'
import Droplist1 from './droplist1'

function App() {

  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");
  const [result, setResult] = useState(0);


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
      <Map />
    </div>
  );
}

export default App;

