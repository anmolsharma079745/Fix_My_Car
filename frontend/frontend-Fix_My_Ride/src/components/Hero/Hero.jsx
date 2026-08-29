import React, { useState } from "react";
import "./Hero.css";

import heroImage from "../../assets/images/HeroCar.jpg";

const Hero = () => {

    const [showLoginPopup, setShowLoginPopup] = useState(false);


    // =====================================================
    // BOOK SERVICE
    // =====================================================

    const handleBookService = () => {

        const storedUser = localStorage.getItem("user");

        // User login nahi hai
        if (!storedUser) {

            setShowLoginPopup(true);

            return;
        }


        let user;

        try {

            user = JSON.parse(storedUser);

        } catch (error) {

            localStorage.removeItem("user");

            setShowLoginPopup(true);

            return;
        }


        // Sirf customer ko booking access
        if (user?.role === "customer") {

            window.location.href = "/customer-dashboard";

        } else {

            setShowLoginPopup(true);

        }

    };


    // =====================================================
    // EXPLORE SERVICES
    // =====================================================

    const handleExploreServices = () => {

        const servicesSection =
            document.getElementById("services");

        if (servicesSection) {

            servicesSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    };


    // =====================================================
    // LOGIN POPUP
    // =====================================================

    const handleLogin = () => {

        window.location.href = "/login";

    };


    return (

        <>

            <section className="hero" id="about">


                {/* =====================================================
                    LEFT CONTENT
                ===================================================== */}

                <div className="hero-content">

                    <h1>
                        Keep Your Vehicle
                        <span> Running Like New</span>
                    </h1>


                    <p>
                        Professional vehicle servicing at your doorstep.
                        Book trusted mechanics, track repairs, and keep
                        your ride in perfect condition.
                    </p>


                    <div className="hero-buttons">


                        {/* BOOK SERVICE */}

                        <button
                            className="primary-btn"
                            onClick={handleBookService}
                        >
                            Book Service
                        </button>


                        {/* EXPLORE SERVICES */}

                        <button
                            className="primary-btn"
                            onClick={handleExploreServices}
                        >
                            Explore Services
                        </button>


                    </div>

                </div>


                {/* =====================================================
                    RIGHT IMAGE
                ===================================================== */}

                <div className="hero-image">

                    <div className="image-glow"></div>


                    <img
                        src={heroImage}
                        alt="Car Repair Service"
                    />

                </div>


            </section>


            {/* =====================================================
                LOGIN POPUP
            ===================================================== */}

            {showLoginPopup && (

                <div
                    className="login-popup-overlay"
                    onClick={() => setShowLoginPopup(false)}
                >

                    <div
                        className="login-popup"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <div className="login-popup-icon">
                            <i className="ri-lock-line"></i>
                        </div>


                        <h2>
                            Login Required
                        </h2>


                        <p>
                            Please login as a customer first
                            to book a vehicle service.
                        </p>


                        <div className="login-popup-buttons">

                            <button
                                className="popup-login-btn"
                                onClick={handleLogin}
                            >
                                Login
                            </button>


                            <button
                                className="popup-cancel-btn"
                                onClick={() =>
                                    setShowLoginPopup(false)
                                }
                            >
                                Cancel
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </>

    );

};

export default Hero;