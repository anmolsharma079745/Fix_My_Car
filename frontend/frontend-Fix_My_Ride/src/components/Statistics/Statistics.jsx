import React, { useEffect, useState } from "react";
import axios from "axios";

import "./Statistics.css";


const Statistics = ({ theme }) => {

    // =====================================================
    // STATES
    // =====================================================

    const [statistics, setStatistics] = useState({

        customers: 0,

        completedServices: 0,

        mechanics: 0,

        satisfaction: 99

    });


    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // =====================================================
    // FETCH PUBLIC STATISTICS
    // =====================================================

    useEffect(() => {

        const fetchStatistics = async () => {

            try {

                setLoading(true);

                setError("");


                const response = await axios.get(
                    "http://localhost:5000/api/dashboard/public-stats"
                );


                setStatistics(
                    response.data?.statistics || {

                        customers: 0,

                        completedServices: 0,

                        mechanics: 0,

                        satisfaction: 99

                    }
                );

            }

            catch (error) {

                console.error(
                    "Fetch Statistics Error:",
                    error
                );


                setError(
                    "Unable to load achievements."
                );

            }

            finally {

                setLoading(false);

            }

        };


        fetchStatistics();

    }, []);


    // =====================================================
    // STATISTICS DATA
    // =====================================================

    const stats = [

        {
            id: 1,

            number:
                `${statistics.customers}+`,

            title:
                "Happy Customers"

        },


        {
            id: 2,

            number:
                `${statistics.completedServices}+`,

            title:
                "Completed Services"

        },


        {
            id: 3,

            number:
                `${statistics.mechanics}+`,

            title:
                "Verified Mechanics"

        },


        {
            id: 4,

            number:
                `${statistics.satisfaction}%`,

            title:
                "Customer Satisfaction"

        }

    ];


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <section
                className={`statistics ${theme || ""}`}
            >

                <div className="statistics-header">

                    <h2>
                        Our <span>Achievements</span>
                    </h2>

                    <p>
                        Trusted by customers for reliable and
                        professional vehicle maintenance services.
                    </p>

                </div>


                <div className="statistics-loading">

                    <i className="ri-loader-4-line"></i>

                    Loading achievements...

                </div>

            </section>

        );

    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        return (

            <section
                className={`statistics ${theme || ""}`}
            >

                <div className="statistics-header">

                    <h2>
                        Our <span>Achievements</span>
                    </h2>

                    <p>
                        Trusted by customers for reliable and
                        professional vehicle maintenance services.
                    </p>

                </div>


                <div className="statistics-error">

                    <i className="ri-error-warning-line"></i>

                    <span>
                        {error}
                    </span>

                </div>

            </section>

        );

    }


    // =====================================================
    // MAIN JSX
    // =====================================================

    return (

        <section
            className={`statistics ${theme || ""}`}
        >

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="statistics-header">

                <h2>
                    Our <span>Achievements</span>
                </h2>


                <p>
                    Trusted by customers for reliable and
                    professional vehicle maintenance services.
                </p>

            </div>


            {/* =================================================
                STATISTICS
            ================================================= */}

            <div className="statistics-container">

                {stats.map((item) => (

                    <div
                        className="stat-card"
                        key={item.id}
                    >

                        <h3>
                            {item.number}
                        </h3>


                        <p>
                            {item.title}
                        </p>

                    </div>

                ))}

            </div>

        </section>

    );

};


export default Statistics;