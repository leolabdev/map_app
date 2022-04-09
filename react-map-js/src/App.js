import React from 'react'
import { BrowserRouter, Outlet } from 'react-router-dom';
import AppRouter from './components/AppRouter/AppRouter';
import Navbar from './components/Navbar/Navbar';
import './App.css'
import { CssBaseline } from '@material-ui/core';
const App = () => {
 
  return (
    
    <BrowserRouter>
    <CssBaseline />
    <Navbar/>
    <Outlet/>
   <AppRouter/>
    
  </BrowserRouter>
  )
  
}

export default App