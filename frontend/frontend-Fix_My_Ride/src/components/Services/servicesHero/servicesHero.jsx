import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./servicesHero.css";


const ServicesHero = ({ theme }) => {

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
                    "/customer-dashboard?section=book-service",
                    {
                        replace: false
                    }
                );

                return;

            }



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



    const handleLogin = () => {

        setShowLoginPopup(false);

        navigate("/login");

    };



    const closePopup = () => {

        setShowLoginPopup(false);

    };



    return (

        <section
            className={`services-hero ${theme || ""}`}
        >

            <div className="services-hero-content">



                <span className="services-hero-badge">

                    FIX MY RIDE

                </span>



                <h1>

                    Professional Vehicle

                    <span> Services</span>

                </h1>



                <p>

                    From routine maintenance to major repairs,
                    Fix My Ride connects you with trusted mechanics
                    to keep your vehicle safe, reliable and
                    running like new.

                </p>



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



                        <div className="services-login-icon">

                            <i className="ri-lock-line"></i>

                        </div>



                        <h2>

                            Login Required

                        </h2>



                        <p>

                            Please login as a customer
                            before booking a service.

                        </p>



                        <div className="services-login-buttons">



                            <button
                                type="button"
                                className="services-login-btn"
                                onClick={handleLogin}
                            >

                                <i className="ri-login-box-line"></i>

                                Login

                            </button>



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