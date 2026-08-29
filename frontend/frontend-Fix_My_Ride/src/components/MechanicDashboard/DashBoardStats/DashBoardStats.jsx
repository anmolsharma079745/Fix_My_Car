
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import "./DashBoardStats.css";
import API_BASE_URL from "../../../services/Api/api";

const BOOKING_API = `${API_BASE_URL}/api/booking`;

const DashBoardStats = ({ theme }) => {

    // =====================================================
    // STATES
    // =====================================================

    const [stats, setStats] = useState({
        assigned: 0,
        pending: 0,
        inProgress: 0,
        completed: 0
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =====================================================
    // GET TOKEN
    // =====================================================

    const getToken = () => {
        return localStorage.getItem("token");
    };


    // =====================================================
    // FETCH MECHANIC BOOKINGS
    // =====================================================

    const fetchMechanicStats = useCallback(async () => {

        try {

            setLoading(true);
            setError("");

            const token = getToken();


            // =================================================
            // TOKEN CHECK
            // =================================================

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


            // =================================================
            // API REQUEST
            // =================================================

            const response = await axios.get(
                `${BOOKING_API}/mechanic/assigned`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );


            // =================================================
            // GET BOOKINGS
            // =================================================

            const bookings = Array.isArray(response.data?.bookings)
                ? response.data.bookings
                : [];


            console.log(
                "Mechanic Assigned Bookings:",
                bookings
            );


            // =================================================
            // CALCULATE STATS
            // =================================================

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


                // ---------------------------------------------
                // PENDING
                // ---------------------------------------------

                if (status === "pending") {

                    pending++;

                }


                // ---------------------------------------------
                // IN PROGRESS
                // ---------------------------------------------

                else if (status === "in progress") {

                    inProgress++;

                }


                // ---------------------------------------------
                // COMPLETED
                // ---------------------------------------------

                else if (status === "completed") {

                    completed++;

                }

            });


            // =================================================
            // UPDATE STATS
            // =================================================

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


    // =====================================================
    // LOAD DATA
    // =====================================================

    useEffect(() => {

        fetchMechanicStats();

    }, [fetchMechanicStats]);


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <section
            className={`mechanicStatsSection ${theme || ""}`}
        >

            <div className="mechanicStatsWrapper">


                {/* =================================================
                    HEADER
                ================================================= */}

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


                {/* =================================================
                    ERROR
                ================================================= */}

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


                {/* =================================================
                    STATS CARDS
                ================================================= */}

                <div className="mechanicStatsCards">


                    {/* =================================================
                        ASSIGNED
                    ================================================= */}

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


                    {/* =================================================
                        PENDING
                    ================================================= */}

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


                    {/* =================================================
                        IN PROGRESS
                    ================================================= */}

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


                    {/* =================================================
                        COMPLETED
                    ================================================= */}

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

