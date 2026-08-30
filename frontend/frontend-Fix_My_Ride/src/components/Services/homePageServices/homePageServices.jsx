import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../../../services/Api/api";
import "./homePageServices.css";


const Service = ({ theme }) => {

    const navigate = useNavigate();



    const [services, setServices] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [showLoginPopup, setShowLoginPopup] = useState(false);



    useEffect(() => {

        const fetchServices = async () => {

            try {

                setLoading(true);

                setError("");


                const response = await axios.get(
                    `${API_BASE_URL}/api/service/all`
                );


                const allServices =
                    response.data?.services || [];



                const latestServices =
                    allServices.slice(0, 6);


                setServices(latestServices);

            }

            catch (error) {

                console.error(
                    "Fetch Services Error:",
                    error
                );


                setError(
                    "Unable to load services."
                );

            }

            finally {

                setLoading(false);

            }

        };


        fetchServices();

    }, []);



    const getServiceIcon = (serviceName) => {

        const name =
            serviceName?.toLowerCase() || "";


        if (name.includes("oil")) {

            return "ri-oil-line";

        }


        if (
            name.includes("engine") ||
            name.includes("repair")
        ) {

            return "ri-settings-3-line";

        }


        if (name.includes("brake")) {

            return "ri-disc-line";

        }


        if (
            name.includes("ac") ||
            name.includes("air")
        ) {

            return "ri-snowy-line";

        }


        if (name.includes("battery")) {

            return "ri-battery-2-charge-line";

        }


        if (
            name.includes("inspection") ||
            name.includes("check")
        ) {

            return "ri-search-eye-line";

        }


        return "ri-tools-line";

    };



    const getVehicleIcon = (vehicleType) => {

        if (vehicleType === "Bike") {

            return "ri-motorbike-line";

        }


        if (vehicleType === "Both") {

            return "ri-car-washing-line";

        }


        return "ri-car-line";

    };



    const getLoggedInCustomer = () => {

        const storedUser =
            localStorage.getItem("user");



        if (!storedUser) {

            setShowLoginPopup(true);

            return null;

        }


        try {

            const user =
                JSON.parse(storedUser);



            if (
                !user ||
                user.role !== "customer"
            ) {

                setShowLoginPopup(true);

                return null;

            }


            return user;

        }

        catch (error) {

            console.error(
                "User Data Error:",
                error
            );


            localStorage.removeItem("user");

            setShowLoginPopup(true);

            return null;

        }

    };



    const handleBookService = (serviceId) => {

        const user =
            getLoggedInCustomer();


        if (!user) {

            return;

        }


        navigate(
            `/customer-dashboard?section=book-service&serviceId=${serviceId}`
        );

    };



    const handleShowAllServices = () => {

        const user =
            getLoggedInCustomer();


        if (!user) {

            return;

        }


        navigate("/services");

    };



    const handleLogin = () => {

        setShowLoginPopup(false);

        navigate("/login");

    };



    const closePopup = () => {

        setShowLoginPopup(false);

    };



    if (loading) {

        return (

            <section
                className={`services ${theme || ""}`}
                id="services"
            >

                <div className="services-header">

                    <h2>
                        Our <span>Services</span>
                    </h2>


                    <p>
                        Professional vehicle maintenance
                        services handled by trusted mechanics.
                    </p>

                </div>


                <div className="services-loading">

                    <i className="ri-loader-4-line"></i>

                    Loading services...

                </div>

            </section>

        );

    }



    return (

        <section
            className={`services ${theme || ""}`}
            id="services"
        >



            <div className="services-header">

                <h2>
                    Our <span>Services</span>
                </h2>


                <p>
                    Professional vehicle maintenance services
                    handled by trusted mechanics.
                </p>

            </div>



            {error && (

                <div className="services-error">

                    <i className="ri-error-warning-line"></i>

                    <span>
                        {error}
                    </span>

                </div>

            )}



            {!error &&
                services.length === 0 && (

                    <div className="services-empty">

                        <i className="ri-tools-line"></i>

                        <p>
                            No services available right now.
                        </p>

                    </div>

                )
            }



            {!error &&
                services.length > 0 && (

                    <>

                        <div className="services-container">

                            {services.map((service) => (

                                <div
                                    className="service-card"
                                    key={service._id}
                                >



                                    <div className="service-card-icon">

                                        <i
                                            className={
                                                getServiceIcon(
                                                    service.serviceName
                                                )
                                            }
                                        ></i>

                                    </div>



                                    <h3>
                                        {service.serviceName}
                                    </h3>



                                    <p className="service-card-description">

                                        {service.description}

                                    </p>



                                    <div className="service-vehicle-type">

                                        <i
                                            className={
                                                getVehicleIcon(
                                                    service.vehicleType
                                                )
                                            }
                                        ></i>

                                        <span>
                                            {service.vehicleType || "Car"}
                                        </span>

                                    </div>



                                    <div className="service-details">



                                        <div className="service-detail-item">

                                            <i className="ri-money-rupee-circle-line"></i>


                                            <div className="service-detail-info">

                                                <span>
                                                    Price
                                                </span>

                                                <strong>
                                                    {service.price}
                                                </strong>

                                            </div>

                                        </div>



                                        <div className="service-detail-item">

                                            <i className="ri-time-line"></i>


                                            <div className="service-detail-info">

                                                <span>
                                                    Duration
                                                </span>

                                                <strong>
                                                    {service.duration}
                                                </strong>

                                            </div>

                                        </div>

                                    </div>



                                    <button
                                        type="button"
                                        className="service-book-btn"
                                        onClick={() =>
                                            handleBookService(
                                                service._id
                                            )
                                        }
                                    >

                                        <i className="ri-calendar-check-line"></i>

                                        <span>
                                            Book Now
                                        </span>

                                    </button>

                                </div>

                            ))}

                        </div>



                        <div className="show-all-services">

                            <button
                                type="button"
                                className="show-all-services-btn"
                                onClick={
                                    handleShowAllServices
                                }
                            >

                                <span>
                                    Show All Services
                                </span>


                                <i className="ri-arrow-right-line"></i>

                            </button>

                        </div>

                    </>

                )
            }



            {showLoginPopup && (

                <div
                    className="service-login-overlay"
                    onClick={closePopup}
                >

                    <div
                        className="service-login-popup"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >



                        <div className="service-popup-icon">

                            <i className="ri-lock-line"></i>

                        </div>



                        <h2>
                            Login Required
                        </h2>



                        <p>
                            Please login as a customer
                            before booking a service.
                        </p>



                        <div className="service-popup-buttons">


                            <button
                                type="button"
                                className="service-popup-login"
                                onClick={handleLogin}
                            >

                                <i className="ri-login-box-line"></i>

                                <span>
                                    Login
                                </span>

                            </button>


                            <button
                                type="button"
                                className="service-popup-cancel"
                                onClick={closePopup}
                            >

                                <i className="ri-close-line"></i>

                                <span>
                                    Cancel
                                </span>

                            </button>

                        </div>

                    </div>

                </div>

            )}

        </section>

    );

};


export default Service;