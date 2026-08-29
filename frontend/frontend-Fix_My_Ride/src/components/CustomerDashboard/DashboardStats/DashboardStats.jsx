import React, { useEffect, useState } from "react";
import axios from "axios";
import "./DashboardStats.css";
import "remixicon/fonts/remixicon.css";
import API_BASE_URL from "../../../services/Api/api";
const DashboardStats = ({ theme }) => {

    const [stats, setStats] = useState({
        vehicles: 0,
        activeBookings: 0,
        completedServices: 0,
        pendingServices: 0
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =====================================================
    // FETCH DASHBOARD STATS
    // =====================================================

    useEffect(() => {
        fetchDashboardStats();
    }, []);


    const fetchDashboardStats = async () => {

        try {

            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            if (!token) {

                setError("Customer login token not found.");
                return;

            }


            // =================================================
            // FETCH VEHICLES
            // =================================================

            const vehicleResponse = await axios.get(
                `${API_BASE_URL}/api/vehicle/all`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );


            // =================================================
            // FETCH BOOKINGS
            // =================================================

            const bookingResponse = await axios.get(
               `${API_BASE_URL}/api/booking/all`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );


            const vehicles =
                vehicleResponse.data.vehicles || [];


            const bookings =
                bookingResponse.data.bookings || [];


            // =================================================
            // CALCULATE STATS
            // =================================================

            const activeBookings = bookings.filter(
                (booking) =>
                    booking.status === "confirmed" ||
                    booking.status === "In Progress"
            ).length;


            const completedServices = bookings.filter(
                (booking) =>
                    booking.status === "Completed"
            ).length;


            const pendingServices = bookings.filter(
                (booking) =>
                    booking.status === "pending"
            ).length;


            // =================================================
            // SET STATS
            // =================================================

            setStats({
                vehicles: vehicles.length,
                activeBookings,
                completedServices,
                pendingServices
            });


        } catch (error) {

            console.error(
                "Dashboard Stats Error:",
                error.response?.data || error.message
            );


            setError(
                error.response?.data?.message ||
                "Unable to fetch dashboard statistics."
            );


        } finally {

            setLoading(false);

        }

    };


   return (

    <section className={`dashboard-stats-section ${theme}`}>

        <div className="dashboard-stats">

            {/* =================================================
                SECTION HEADER
            ================================================= */}

            <div className="stats-header">

                <div>

                    <span className="stats-tag">
                        OVERVIEW
                    </span>

                    <h2>
                        Your Service Overview
                    </h2>

                    <p>
                        Keep track of your vehicles and service activities.
                    </p>

                </div>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="stats-error">

                    <i className="ri-error-warning-line"></i>

                    <span>
                        {error}
                    </span>

                </div>

            )}


            {/* =================================================
                STAT CARDS
            ================================================= */}

            <div className="stats-grid">


                {/* MY VEHICLES */}

                <div className="stat-card">

                    <div className="stat-icon">
                        <i className="ri-car-line"></i>
                    </div>

                    <div className="stat-content">

                        <h3>
                            {loading ? "..." : stats.vehicles}
                        </h3>

                        <p>
                            My Vehicles
                        </p>

                    </div>

                </div>


                {/* ACTIVE BOOKINGS */}

                <div className="stat-card">

                    <div className="stat-icon">
                        <i className="ri-calendar-check-line"></i>
                    </div>

                    <div className="stat-content">

                        <h3>
                            {loading ? "..." : stats.activeBookings}
                        </h3>

                        <p>
                            Active Bookings
                        </p>

                    </div>

                </div>


                {/* COMPLETED SERVICES */}

                <div className="stat-card">

                    <div className="stat-icon">
                        <i className="ri-checkbox-circle-line"></i>
                    </div>

                    <div className="stat-content">

                        <h3>
                            {loading ? "..." : stats.completedServices}
                        </h3>

                        <p>
                            Completed Services
                        </p>

                    </div>

                </div>


                {/* PENDING SERVICES */}

                <div className="stat-card">

                    <div className="stat-icon">
                        <i className="ri-time-line"></i>
                    </div>

                    <div className="stat-content">

                        <h3>
                            {loading ? "..." : stats.pendingServices}
                        </h3>

                        <p>
                            Pending Services
                        </p>

                    </div>

                </div>

            </div>

        </div>

    </section>

);

};


export default DashboardStats;