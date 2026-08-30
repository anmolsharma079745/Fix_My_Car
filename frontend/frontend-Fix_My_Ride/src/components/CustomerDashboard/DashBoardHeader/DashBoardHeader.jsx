import React from "react";
import "./DashBoardHeader.css";
import "remixicon/fonts/remixicon.css";

const DashBoardHeader = ({ theme }) => {

  const storedUser = localStorage.getItem("user");

  let userName = "Customer";

  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      userName = user?.name || "Customer";
    } catch (error) {
      console.error("Invalid user data");
    }
  }

  return (
  <section className={`dashboard-header-section ${theme}`}>

    <div className="dashboard-header">


      <div className="dashboard-header-content">

        <span className="dashboard-header-tag">
          CUSTOMER PANEL
        </span>

        <h1>
          Customer Dashboard
        </h1>

        <p>
          Manage your vehicles, book services, and track your
          vehicle servicing easily from one place.
        </p>

      </div>



      <div className="dashboard-welcome">

        <div className="welcome-icon">
          <i className="ri-hand-coin-line"></i>
        </div>

        <div className="welcome-content">

          <h3>
            Welcome Back, {userName}!
          </h3>

          <p>
            Ready to take care of your ride?
          </p>

        </div>

      </div>

    </div>

  </section>
);
};

export default DashBoardHeader;