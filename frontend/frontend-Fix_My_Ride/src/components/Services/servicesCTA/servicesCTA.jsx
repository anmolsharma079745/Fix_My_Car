import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./servicesCTA.css";


const ServiceCTA = ({ theme }) => {

    const navigate = useNavigate();

    const [showLoginPopup, setShowLoginPopup] = useState(false);



    const handleBookService = () => {

        const storedUser = localStorage.getItem("user");



        if (!storedUser) {

            setShowLoginPopup(true);

            return;

        }


        try {

            const user = JSON.parse(storedUser);



            if (user?.role === "customer") {

                navigate(
                    "/customer-dashboard?section=book-service"
                );

            } else {

                setShowLoginPopup(true);

            }

        } catch (error) {

            console.error(
                "User Data Error:",
                error
            );

            localStorage.removeItem("user");

            setShowLoginPopup(true);

        }

    };



    const handleLogin = () => {

        setShowLoginPopup(false);

        navigate("/login");

    };



    const closePopup = () => {

        setShowLoginPopup(false);

    };


    return (

        <>


            <section
                className={`services-cta ${theme || ""}`}
            >

                <div className="services-cta-content">



                    <div className="services-cta-icon">

                        <i className="ri-car-washing-line"></i>

                    </div>



                    <h2>

                        Keep Your Vehicle

                        <span> Running Smoothly</span>

                    </h2>



                    <p>

                        Don't wait for a small problem to become
                        a major repair. Book a professional vehicle
                        service with Fix My Ride today.

                    </p>


                    {/* BUTTON */}

                    <button
                        className="services-cta-btn"
                        onClick={handleBookService}
                    >

                        <i className="ri-calendar-check-line"></i>

                        Book a Service

                        <i className="ri-arrow-right-line"></i>

                    </button>


                </div>


                {/* =================================================
                    DECORATIVE ICONS
                ================================================= */}

                <div className="services-cta-decoration services-cta-decoration-one">

                    <i className="ri-tools-line"></i>

                </div>


                <div className="services-cta-decoration services-cta-decoration-two">

                    <i className="ri-settings-3-line"></i>

                </div>


                {/* =================================================
                    LOGIN REQUIRED POPUP
                ================================================= */}

                {showLoginPopup && (

                    <div
                        className="services-cta-overlay"
                        onClick={closePopup}
                    >

                        <div
                            className="services-cta-popup"
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                        >


                            {/* POPUP ICON */}

                            <div className="services-cta-popup-icon">

                                <i className="ri-lock-line"></i>

                            </div>


                            {/* TITLE */}

                            <h3>

                                Login Required

                            </h3>


                            {/* MESSAGE */}

                            <p>

                                Please login as a customer
                                before booking a vehicle service.

                            </p>


                            {/* BUTTONS */}

                            <div className="services-cta-popup-buttons">


                                <button
                                    className="services-cta-login-btn"
                                    onClick={handleLogin}
                                >

                                    <i className="ri-login-box-line"></i>

                                    Login

                                </button>


                                <button
                                    className="services-cta-cancel-btn"
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

        </>

    );

};


export default ServiceCTA;