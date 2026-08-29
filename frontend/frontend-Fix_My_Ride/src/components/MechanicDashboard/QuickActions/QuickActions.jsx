import React from "react";
import './QuickActions.css'

const quickActions=({theme})=>{
    return <>
        <section className={`quick-actions ${theme}`}>

      <div className="quick-actions-container">

        <div className="quick-actions-heading">

          <span className="dashboard-tag">
            Quick Actions
          </span>

          <h2>
            Manage Your Services
          </h2>

          <p>
            Quickly access the actions you need to manage your assigned services.
          </p>

        </div>


        <div className="quick-actions-grid">

          {/* Update Status */}

          <button className="quick-action-card">

            <div className="quick-action-icon">
              ⚙️
            </div>

            <div className="quick-action-content">

              <h3>
                Update Service Status
              </h3>

              <p>
                Update the current status of an assigned service.
              </p>

            </div>

          </button>


          {/* Service Notes */}

          <button className="quick-action-card">

            <div className="quick-action-icon">
              📝
            </div>

            <div className="quick-action-content">

              <h3>
                Add Service Notes
              </h3>

              <p>
                Add important notes and details about the service.
              </p>

            </div>

          </button>


          {/* Assigned Services */}

          <button className="quick-action-card">

            <div className="quick-action-icon">
              🔧
            </div>

            <div className="quick-action-content">

              <h3>
                View Assigned Services
              </h3>

              <p>
                Check all services currently assigned to you.
              </p>

            </div>

          </button>

        </div>

      </div>

    </section>
    </>
}

export default quickActions

