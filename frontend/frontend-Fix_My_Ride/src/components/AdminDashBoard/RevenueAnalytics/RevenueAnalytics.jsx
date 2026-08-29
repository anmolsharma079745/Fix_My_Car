import React, { useEffect, useState } from "react";
import axios from "axios";
import "./RevenueAnalytics.css";
import API_BASE_URL from "../../../services/Api/api";
const RevenueAnalytics = ({ theme }) => {

    const [revenue, setRevenue] = useState({
        totalRevenue: 0,
        totalCompletedBookings: 0,
        averageRevenue: 0
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =====================================================
    // FETCH REVENUE DATA
    // =====================================================

    useEffect(() => {

        fetchRevenue();

    }, []);


    const fetchRevenue = async () => {

        try {

            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            if (!token) {

                setError("Admin login token not found.");

                return;

            }


            const response = await axios.get(
                `${API_BASE_URL}/api/admin/revenue`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );


            console.log(
                "Revenue Analytics Response:",
                response.data
            );


            setRevenue({

                totalRevenue:
                    response.data.data?.totalRevenue || 0,

                totalCompletedBookings:
                    response.data.data?.totalCompletedBookings || 0,

                averageRevenue:
                    response.data.data?.averageRevenue || 0

            });


        } catch (error) {

            console.error(
                "Revenue Analytics Error:",
                error.response?.data || error.message
            );


            setError(
                error.response?.data?.message ||
                "Unable to fetch revenue analytics."
            );


        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // FORMAT CURRENCY
    // =====================================================

    const formatCurrency = (amount) => {

        return `₹${Number(amount || 0).toLocaleString("en-IN")}`;

    };


    return (

        <section className={`revenue-analytics ${theme}`}>

            <div className="revenue-analytics-container">


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="revenue-analytics-header">

                    <div>

                        <span className="revenue-analytics-tag">
                            FINANCIAL OVERVIEW
                        </span>


                        <h2>
                            Revenue Analytics
                        </h2>


                        <p>
                            Track revenue generated from completed
                            service bookings.
                        </p>

                    </div>

                </div>



                {/* =================================================
                    CONTENT
                ================================================= */}

                <div className="revenue-analytics-content">


                    {/* =================================================
                        LOADING
                    ================================================= */}

                    {loading && (

                        <div className="revenue-message">

                            <i className="ri-loader-4-line"></i>

                            <span>
                                Loading revenue analytics...
                            </span>

                        </div>

                    )}



                    {/* =================================================
                        ERROR
                    ================================================= */}

                    {!loading && error && (

                        <div className="revenue-message error-message">

                            <i className="ri-error-warning-line"></i>

                            <span>
                                {error}
                            </span>

                        </div>

                    )}



                    {/* =================================================
                        REVENUE CARDS
                    ================================================= */}

                    {!loading && !error && (

                        <div className="revenue-grid">


                            {/* TOTAL REVENUE */}

                            <div className="revenue-card">

                                <div className="revenue-icon">

                                    <i className="ri-money-rupee-circle-line"></i>

                                </div>


                                <div className="revenue-card-content">

                                    <span>
                                        Total Revenue
                                    </span>


                                    <h3>
                                        {
                                            formatCurrency(
                                                revenue.totalRevenue
                                            )
                                        }
                                    </h3>


                                    <p>
                                        Revenue from completed services
                                    </p>

                                </div>

                            </div>



                            {/* COMPLETED BOOKINGS */}

                            <div className="revenue-card">

                                <div className="revenue-icon">

                                    <i className="ri-checkbox-circle-line"></i>

                                </div>


                                <div className="revenue-card-content">

                                    <span>
                                        Completed Bookings
                                    </span>


                                    <h3>
                                        {
                                            revenue.totalCompletedBookings
                                        }
                                    </h3>


                                    <p>
                                        Successfully completed services
                                    </p>

                                </div>

                            </div>



                            {/* AVERAGE REVENUE */}

                            <div className="revenue-card">

                                <div className="revenue-icon">

                                    <i className="ri-bar-chart-box-line"></i>

                                </div>


                                <div className="revenue-card-content">

                                    <span>
                                        Average Revenue
                                    </span>


                                    <h3>
                                        {
                                            formatCurrency(
                                                revenue.averageRevenue
                                            )
                                        }
                                    </h3>


                                    <p>
                                        Average revenue per booking
                                    </p>

                                </div>

                            </div>


                        </div>

                    )}

                </div>

            </div>

        </section>

    );

};


export default RevenueAnalytics;