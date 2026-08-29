import React from "react";
import './DashBoardHeader.css'

const dashBoardHeader=({ theme })=>{
    return <section className={`dashboard-header ${theme}`}>

      <div className="dashboard-header-content">

        <div className="dashboard-header-text">

          <span className="dashboard-header-tag">
            ADMIN PANEL
          </span>

          <h1>
            Admin Dashboard
          </h1>

          <p>
            Manage customers, mechanics, bookings, services and
            monitor your Fix My Ride platform from one place.
          </p>

        </div>

        <div className="dashboard-header-info">

          <div className="dashboard-status">
            <span className="status-dot"></span>
            System Active
          </div>

          <div className="dashboard-welcome">
            Welcome, Admin
          </div>

        </div>

      </div>

    </section>
}
export default dashBoardHeader 