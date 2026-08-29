import React, { useEffect, useState } from "react";
import "./DashBoardStats.css";
import axios from "axios";
import API_BASE_URL from "../../../services/Api/api";

const DashBoardStats = ({ theme }) => {

    const [stats, setStats] = useState({
        totalUsers: 0,
        totalCustomers: 0,
        totalMechanics: 0,
        totalAdmins: 0,
        totalVehicles: 0,
        totalServices: 0,
        totalBookings: 0
    });

    const [loading, setLoading] = useState(true);


    // =========================================
    // FETCH DASHBOARD DATA
    // =========================================

    useEffect(() => {

        fetchDashboardStats();

    }, []);


    const fetchDashboardStats = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await axios.get(
                `${API_BASE_URL}/api/admin/dashboard`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );


            console.log(
                "Admin Dashboard Response:",
                response.data
            );


            // Backend response ke andar data object
            const dashboardData = response.data.data;


            setStats({

                totalUsers:
                    dashboardData?.totalUsers || 0,

                totalCustomers:
                    dashboardData?.totalCustomers || 0,

                totalMechanics:
                    dashboardData?.totalMechanics || 0,

                totalAdmins:
                    dashboardData?.totalAdmins || 0,

                totalVehicles:
                    dashboardData?.totalVehicles || 0,

                totalServices:
                    dashboardData?.totalServices || 0,

                totalBookings:
                    dashboardData?.totalBookings || 0

            });

        }

        catch (error) {

            console.error(
                "Admin Dashboard Stats Error:",
                error.response?.data || error.message
            );

        }

        finally {

            setLoading(false);

        }

    };


    // =========================================
    // STAT CARDS DATA
    // =========================================

    const statCards = [

        {
            title: "Total Users",
            value: stats.totalUsers,
            description: "All registered users",
            icon: "ri-group-line"
        },

        {
            title: "Total Customers",
            value: stats.totalCustomers,
            description: "Registered customers",
            icon: "ri-user-3-line"
        },

        {
            title: "Total Mechanics",
            value: stats.totalMechanics,
            description: "Registered mechanics",
            icon: "ri-tools-line"
        },

        {
            title: "Total Admins",
            value: stats.totalAdmins,
            description: "Registered admins",
            icon: "ri-admin-line"
        },

        {
            title: "Total Vehicles",
            value: stats.totalVehicles,
            description: "Registered vehicles",
            icon: "ri-car-line"
        },

        {
            title: "Total Services",
            value: stats.totalServices,
            description: "Available services",
            icon: "ri-service-line"
        },

        {
            title: "Total Bookings",
            value: stats.totalBookings,
            description: "Service bookings",
            icon: "ri-calendar-check-line"
        }

    ];


    return (

        <section className={`dashboard-stats ${theme}`}>

            <div className="dashboard-stats-container">
                <div className="dashboard-stats-header">

            <span className="dashboard-stats-tag">
                ADMIN OVERVIEW
            </span>

            <h2 className="dashboard-stats-title">
                Dashboard Statistics
            </h2>

            <p className="dashboard-stats-description">
                Overview of users, vehicles, services and bookings.
            </p>

        </div>

                {statCards.map((card) => (

                    <div
                        className="stat-card"
                        key={card.title}
                    >

                        <div className="stat-icon">

                            <i className={card.icon}></i>

                        </div>


                        <div className="stat-content">

                            <p>
                                {card.title}
                            </p>


                            <h3>

                                {loading
                                    ? "..."
                                    : card.value}

                            </h3>


                            <span>
                                {card.description}
                            </span>

                        </div>

                    </div>

                ))}


            </div>

        </section>

    );

};

export default DashBoardStats;