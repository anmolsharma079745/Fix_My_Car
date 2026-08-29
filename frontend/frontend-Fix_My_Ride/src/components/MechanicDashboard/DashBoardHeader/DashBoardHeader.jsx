import React from "react";
import "./DashBoardHeader.css";

const DashBoardHeader = ({ theme }) => {

    return (

        <section
            className={`mechanic-dashboard-header ${theme}`}
        >

            <div className="mechanic-dashboard-header-content">

                <div className="mechanic-dashboard-welcome">

                    {/* DASHBOARD TAG */}

                    <span className="dashboard-tag">
                        Mechanic Dashboard
                    </span>


                    {/* MAIN HEADING */}

                    <h1>
                        Keep Every Ride{" "}
                        <span>
                            Running Smoothly.
                        </span>
                    </h1>


                    {/* DESCRIPTION */}

                    <p>
                        Manage your assigned services, track ongoing
                        repairs, update service status, and review your
                        completed work — all from one place.
                    </p>


                </div>

            </div>

        </section>

    );

};

export default DashBoardHeader;