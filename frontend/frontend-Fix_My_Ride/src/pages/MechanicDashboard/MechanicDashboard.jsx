import React from "react";
import './MechanicDashboard.css'

import Header from '../../components/Header/Header.jsx'
import Footer from '../../components/Footer/Footer.jsx'

import DashBoardHeader from "../../components/MechanicDashboard/DashBoardHeader/DashBoardHeader.jsx";
import DashboardStats from "../../components/MechanicDashboard/DashBoardStats/DashBoardStats.jsx";
import AssignedServices from '../../components/MechanicDashboard/AssignedServices/AssignedServices.jsx'
import CurrentService from "../../components/MechanicDashboard/CurrentService/CurrentService.jsx";
import QuickActions from "../../components/MechanicDashboard/QuickActions/QuickActions.jsx";
import ServiceHistory from "../../components/MechanicDashboard/ServiceHistory/ServiceHistory.jsx";

const MechanicDashboard = ({theme, toggleTheme}) => {
  return (
    <>
      <Header theme={theme} toggleTheme={toggleTheme}/>
      <DashBoardHeader theme={theme} />

      <DashboardStats theme={theme} />

      <AssignedServices theme={theme} />

      <CurrentService theme={theme} />

      <QuickActions theme={theme} />

      <ServiceHistory theme={theme} />
      <Footer theme={theme}/>
    </>
  );
};

export default MechanicDashboard;