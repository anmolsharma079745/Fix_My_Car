import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../../pages/Home/Home.jsx";
import Login from "../../pages/Login/Login.jsx";
import Register from "../../pages/Register/Register.jsx";

import ServicesPage from '../../pages/ServicePage/servicePage.jsx'
import CustomerDashboard from "../../pages/CustomerDashboard/CustomerDashboard.jsx";
import MechanicDashboard from "../../pages/MechanicDashboard/MechanicDashboard.jsx";
import AdminDashboard from "../../pages/AdminDashboard/AdminDashboard.jsx";


const AppRoutes = ({ theme, toggleTheme }) => {

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Home theme={theme} toggleTheme={toggleTheme}/>} />

        <Route path="/login" element={<Login theme={theme} toggleTheme={toggleTheme} />}/> 

        <Route path="/register" element={<Register theme={theme} toggleTheme={toggleTheme}/>}/>


        <Route 
          path="/customer-dashboard" 
          element={<CustomerDashboard theme={theme} toggleTheme={toggleTheme}/>} />


        

        <Route
          path="/services"
          element={ <ServicesPage theme={theme} toggleTheme={toggleTheme} />}
        />

        <Route 
          path="/admin-dashboard" 
          element={<AdminDashboard theme={theme} toggleTheme={toggleTheme}/>}
        />

        <Route 
          path="/mechanic-dashboard" 
          element={<MechanicDashboard theme={theme} toggleTheme={toggleTheme}/>}
        />

      </Routes>

    </BrowserRouter>

  )
}


export default AppRoutes;