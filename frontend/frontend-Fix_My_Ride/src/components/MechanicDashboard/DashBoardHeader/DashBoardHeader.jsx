import React from "react";
import "./DashBoardHeader.css";

const DashBoardHeader = ({ theme }) => {

    return (

        <section
            className={`mechanic-dashboard-header ${theme}`}
        >

            <div className="mechanic-dashboard-header-content">

                <div className="mechanic-dashboard-welcome">


                    <span className="dashboard-tag">
                        Mechanic Dashboard
                    </span>



                    <h1>
                        Keep Every Ride{" "}
                        <span>
                            Running Smoothly.
                        </span>
                    </h1>



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