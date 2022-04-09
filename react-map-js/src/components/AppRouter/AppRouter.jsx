import React from 'react'
import { Routes, Route , } from 'react-router-dom';
import About from '../../pages/About';
import Error from '../../pages/Error';
import MapPage from '../../pages/MapPage';
import RegistrationPage from '../../pages/RegistrationPage';

const AppRouter = () => {
  return (
    <Routes>
    <Route exact path="/" element={<MapPage />} />
     <Route path="about" element={<About />} />
     <Route path="registration" element={<RegistrationPage/>} />
     <Route
      path="*"
      element={
        <Error/>
      }
    />

    </Routes>
  )
}

export default AppRouter