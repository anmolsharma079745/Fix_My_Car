
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import "./DashBoardStats.css";
import API_BASE_URL from "../../../services/Api/api";

const BOOKING_API = `${API_BASE_URL}/api/booking`;

const DashBoardStats = ({ theme }) => {


    const [stats, setStats] = useState({
        assigned: 0,
        pending: 0,
        inProgress: 0,
        completed: 0
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");



    const getToken = () => {
        return localStorage.getItem("token");
    };



    const fetchMechanicStats = useCallback(async () => {

        try {

            setLoading(true);
            setError("");

            const token = getToken();



            if (!token) {

                setError("Mechanic login token not found.");

                setStats({
                    assigned: 0,
                    pending: 0,
                    inProgress: 0,
                    completed: 0
                });

                return;
            }



            const response = await axios.get(
                `${BOOKING_API}/mechanic/assigned`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );



            const bookings = Array.isArray(response.data?.bookings)
                ? response.data.bookings
                : [];


            console.log(
                "Mechanic Assigned Bookings:",
                bookings
            );



            let pending = 0;
            let inProgress = 0;
            let completed = 0;


            bookings.forEach((booking) => {

                const status = String(
                    booking?.status || ""
                )
                    .trim()
                    .toLowerCase()
                    .replace(/-/g, " ");



                if (status === "pending") {

                    pending++;

                }



                else if (status === "in progress") {

                    inProgress++;

                }



                else if (status === "completed") {

                    completed++;

                }

            });



            setStats({

                assigned: bookings.length,

                pending,

                inProgress,

                completed

            });

        }

        catch (err) {

            console.error(
                "Mechanic Dashboard Stats Error:",
                err.response?.data || err.message
            );


            setStats({
                assigned: 0,
                pending: 0,
                inProgress: 0,
                completed: 0
            });


            if (err.response?.status === 401) {

                setError(
                    "Your session has expired. Please login again."
                );

            }

            else if (err.response?.status === 403) {

                setError(
                    "You are not authorized to view mechanic services."
                );

            }

            else {

                setError(
                    err.response?.data?.message ||
                    "Unable to load service statistics."
                );

            }

        }

        finally {

            setLoading(false);

        }

    }, []);



    useEffect(() => {

        fetchMechanicStats();

    }, [fetchMechanicStats]);



    return (

        <section
            className={`mechanicStatsSection ${theme || ""}`}
        >

            <div className="mechanicStatsWrapper">



                <div className="mechanicStatsHeader">

                    <span className="mechanicStatsTag">
                        SERVICE OVERVIEW
                    </span>


                    <h2 className="mechanicStatsTitle">
                        Your Service Statistics
                    </h2>


                    <p className="mechanicStatsDescription">
                        Track your assigned services, ongoing work,
                        and completed vehicle services in real time.
                    </p>

                </div>



                {error && (

                    <div className="mechanicStatsError">

                        <i className="ri-error-warning-line"></i>

                        <span>
                            {error}
                        </span>


                        <button
                            type="button"
                            onClick={fetchMechanicStats}
                        >
                            Try Again
                        </button>

                    </div>

                )}



                <div className="mechanicStatsCards">



                    <div className="mechanicStatsCard">

                        <div className="mechanicStatsIcon">

                            <i className="ri-tools-line"></i>

                        </div>


                        <div className="mechanicStatsInfo">

                            <span>
                                Assigned Services
                            </span>


                            <h3>

                                {loading
                                    ? "..."
                                    : stats.assigned
                                }

                            </h3>

                        </div>

                    </div>



                    <div className="mechanicStatsCard">

                        <div className="mechanicStatsIcon">

                            <i className="ri-time-line"></i>

                        </div>


                        <div className="mechanicStatsInfo">

                            <span>
                                Pending Services
                            </span>


                            <h3>

                                {loading
                                    ? "..."
                                    : stats.pending
                                }

                            </h3>

                        </div>

                    </div>



                    <div className="mechanicStatsCard">

                        <div className="mechanicStatsIcon">

                            <i className="ri-loader-4-line"></i>

                        </div>


                        <div className="mechanicStatsInfo">

                            <span>
                                In Progress
                            </span>


                            <h3>

                                {loading
                                    ? "..."
                                    : stats.inProgress
                                }

                            </h3>

                        </div>

                    </div>



                    <div className="mechanicStatsCard">

                        <div className="mechanicStatsIcon">

                            <i className="ri-checkbox-circle-line"></i>

                        </div>


                        <div className="mechanicStatsInfo">

                            <span>
                                Completed Services
                            </span>


                            <h3>

                                {loading
                                    ? "..."
                                    : stats.completed
                                }

                            </h3>

                        </div>

                    </div>

                </div>

            </div>

        </section>

    );

};


export default DashBoardStats;

