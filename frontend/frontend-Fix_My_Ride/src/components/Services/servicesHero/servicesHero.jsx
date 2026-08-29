import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./servicesHero.css";


const ServicesHero = ({ theme }) => {

    const navigate = useNavigate();

    const [showLoginPopup, setShowLoginPopup] = useState(false);


    // =====================================================
    // BOOK SERVICE
    // =====================================================

    const handleBookService = () => {

        const storedUser = localStorage.getItem("user");


        // =================================================
        // NOT LOGGED IN
        // =================================================

        if (!storedUser) {

            setShowLoginPopup(true);

            return;

        }


        try {

            const user = JSON.parse(storedUser);


            // =================================================
            // CUSTOMER
            // =================================================

            if (user?.role === "customer") {

                navigate(
                    "/customer-dashboard?section=book-service",
                    {
                        replace: false
                    }
                );

                return;

            }


            // =================================================
            // OTHER ROLE
            // =================================================

            setShowLoginPopup(true);

        } catch (error) {

            console.error(
                "User Data Error:",
                error
            );

            localStorage.removeItem("user");

            setShowLoginPopup(true);

        }

    };


    // =====================================================
    // LOGIN
    // =====================================================

    const handleLogin = () => {

        setShowLoginPopup(false);

        navigate("/login");

    };


    // =====================================================
    // CLOSE POPUP
    // =====================================================

    const closePopup = () => {

        setShowLoginPopup(false);

    };


    // =====================================================
    // JSX
    // =====================================================

    return (

        <section
            className={`services-hero ${theme || ""}`}
        >

            <div className="services-hero-content">


                {/* =================================================
                    BADGE
                ================================================= */}

                <span className="services-hero-badge">

                    FIX MY RIDE

                </span>


                {/* =================================================
                    HEADING
                ================================================= */}

                <h1>

                    Professional Vehicle

                    <span> Services</span>

                </h1>


                {/* =================================================
                    DESCRIPTION
                ================================================= */}

                <p>

                    From routine maintenance to major repairs,
                    Fix My Ride connects you with trusted mechanics
                    to keep your vehicle safe, reliable and
                    running like new.

                </p>


                {/* =================================================
                    BOOK BUTTON
                ================================================= */}

                <button
                    type="button"
                    className="services-hero-btn"
                    onClick={handleBookService}
                >

                    <i className="ri-calendar-check-line"></i>

                    Book a Service

                    <i className="ri-arrow-right-line"></i>

                </button>


            </div>


            {/* =====================================================
                LOGIN REQUIRED POPUP
            ===================================================== */}

            {showLoginPopup && (

                <div
                    className="services-login-overlay"
                    onClick={closePopup}
                >

                    <div
                        className="services-login-popup"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >


                        {/* POPUP ICON */}

                        <div className="services-login-icon">

                            <i className="ri-lock-line"></i>

                        </div>


                        {/* HEADING */}

                        <h2>

                            Login Required

                        </h2>


                        {/* MESSAGE */}

                        <p>

                            Please login as a customer
                            before booking a service.

                        </p>


                        {/* BUTTONS */}

                        <div className="services-login-buttons">


                            {/* LOGIN */}

                            <button
                                type="button"
                                className="services-login-btn"
                                onClick={handleLogin}
                            >

                                <i className="ri-login-box-line"></i>

                                Login

                            </button>


                            {/* CANCEL */}

                            <button
                                type="button"
                                className="services-cancel-btn"
                                onClick={closePopup}
                            >

                                <i className="ri-close-line"></i>

                                Cancel

                            </button>


                        </div>

                    </div>

                </div>

            )}

        </section>

    );

};


export default ServicesHero;