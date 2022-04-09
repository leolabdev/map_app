import React from 'react'
import { BrowserRouter, Outlet } from 'react-router-dom';
import AppRouter from './components/AppRouter/AppRouter';
// import Navbar from './components/UI/Navbar/Navbar';
// import './styles/App.css';
const App = () => {
 
  return (

    <BrowserRouter>
    {/* <Navbar/> */}
    <Outlet/>
   <AppRouter/>
    
  </BrowserRouter>
  )
  
}

export default App