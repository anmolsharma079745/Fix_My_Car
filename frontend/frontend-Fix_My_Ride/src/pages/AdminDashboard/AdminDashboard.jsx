import React from "react";
import './AdminDashboard.css'

import Header from '../../components/Header/Header.jsx'
import Footer from "../../components/Footer/Footer.jsx";

import DashBoardHeader from "../../components/AdminDashBoard/DashBoardHeader/DashBoardHeader.jsx"
import DashBoardStats from '../../components/AdminDashBoard/DashBoardStats/DashBoardStats.jsx'
import AssignedMechanic from "../../components/AdminDashBoard/AssignMechanic/AssignMechanic.jsx";
import ManageBooking from "../../components/AdminDashBoard/ManageBookings/ManageBookings.jsx";
import ManageMechanics from "../../components/AdminDashBoard/ManageMechanics/ManageMechanics.jsx";
import ManageCustomer from "../../components/AdminDashBoard/ManageCustomers/ManageCustomers.jsx";
import ManageServices from "../../components/AdminDashBoard/ManageServices/ManageServices.jsx";
import RevenueAnalytics from "../../components/AdminDashBoard/RevenueAnalytics/RevenueAnalytics.jsx";


const AdminDashboard = ({theme, toggleTheme}) => {
  return (
    <>
      <Header theme={theme} toggleTheme={toggleTheme}/>
      <DashBoardHeader theme={theme}/>
      <DashBoardStats  theme={theme}/>
      <AssignedMechanic theme={theme} />
      <ManageBooking theme={theme} />
      <ManageMechanics theme={theme} />
      <ManageCustomer theme={theme} />
      <ManageServices theme={theme} />
      <RevenueAnalytics theme={theme} />
      <Footer theme={theme} />
    </>
  );
};

export default AdminDashboard;