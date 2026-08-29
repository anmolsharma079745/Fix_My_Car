import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CurrentService.css";
import "remixicon/fonts/remixicon.css";

const BOOKING_API = "http://localhost:5000/api/booking";

const CurrentService = ({ theme }) => {

    // =====================================================
    // STATES
    // =====================================================

    const [currentService, setCurrentService] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // =====================================================
    // TOKEN
    // =====================================================

    const getToken = () => {

        return localStorage.getItem("token");

    };


    // =====================================================
    // FETCH CURRENT SERVICE
    // =====================================================

    useEffect(() => {

        fetchCurrentService();

    }, []);


    const fetchCurrentService = async () => {

        try {

            setLoading(true);

            setError("");


            const token = getToken();


            if (!token) {

                setError(
                    "Mechanic login token not found."
                );

                setLoading(false);

                return;

            }


            // =================================================
            // GET MECHANIC ASSIGNED BOOKINGS
            // =================================================

            const response = await axios.get(

                `${BOOKING_API}/mechanic/assigned`,

                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }

            );


            console.log(
                "Current Service Response:",
                response.data
            );


            const bookings =
                response.data.bookings ||
                response.data.services ||
                response.data.data ||
                [];


            // =================================================
            // FIND IN PROGRESS SERVICE
            // =================================================

            const activeService =
                bookings.find((booking) => {

                    return (
                        booking.status ===
                        "In Progress"
                    );

                });


            setCurrentService(
                activeService || null
            );


        } catch (err) {

            console.error(
                "Current Service Error:",
                err.response?.data ||
                err.message
            );


            setError(
                err.response?.data?.message ||
                "Unable to fetch current service."
            );


        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (date) => {

        if (!date) {

            return "N/A";

        }


        const newDate =
            new Date(date);


        if (
            Number.isNaN(
                newDate.getTime()
            )
        ) {

            return date;

        }


        return newDate.toLocaleDateString(

            "en-IN",

            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }

        );

    };


    // =====================================================
    // CUSTOMER NAME
    // =====================================================

    const getCustomerName = (service) => {

        if (service?.userId?.name) {

            return service.userId.name;

        }


        if (service?.customerId?.name) {

            return service.customerId.name;

        }


        if (service?.customer?.name) {

            return service.customer.name;

        }


        if (service?.user?.name) {

            return service.user.name;

        }


        return "Customer";

    };


    // =====================================================
    // CUSTOMER PHONE
    // =====================================================

    const getCustomerPhone = (service) => {

        if (service?.userId?.phone) {

            return service.userId.phone;

        }


        if (service?.customerId?.phone) {

            return service.customerId.phone;

        }


        if (service?.customer?.phone) {

            return service.customer.phone;

        }


        if (service?.user?.phone) {

            return service.user.phone;

        }


        return "N/A";

    };


    // =====================================================
    // VEHICLE NAME
    // =====================================================

    const getVehicleName = (service) => {

        if (
            service?.vehicleId &&
            typeof service.vehicleId === "object"
        ) {

            const vehicle =
                service.vehicleId;


            const brand =
                vehicle.brand || "";


            const model =
                vehicle.model || "";


            const fullName =
                `${brand} ${model}`.trim();


            if (fullName) {

                return fullName;

            }


            return (
                vehicle.vehicleName ||
                vehicle.name ||
                "Vehicle"
            );

        }


        if (
            service?.vehicle?.brand ||
            service?.vehicle?.model
        ) {

            return (

                `${service.vehicle.brand || ""} ` +
                `${service.vehicle.model || ""}`

            ).trim();

        }


        return "Vehicle";

    };


    // =====================================================
    // SERVICE NAME
    // =====================================================

    const getServiceName = (service) => {

        if (
            service?.serviceId &&
            typeof service.serviceId === "object"
        ) {

            return (

                service.serviceId.serviceName ||
                service.serviceId.name ||
                "Vehicle Service"

            );

        }


        if (
            service?.service?.serviceName
        ) {

            return service.service.serviceName;

        }


        if (service?.serviceName) {

            return service.serviceName;

        }


        return "Vehicle Service";

    };


    // =====================================================
    // BOOKING ID
    // =====================================================

    const getBookingId = (service) => {

        if (!service?._id) {

            return "N/A";

        }


        return service._id
            .slice(-6)
            .toUpperCase();

    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <section
            className={`current-service ${theme || ""}`}
        >

            <div className="current-service-container">


                {/* =================================================
                    HEADING
                ================================================= */}

                <div className="current-service-heading">

                    <span className="dashboard-tag">
                        ACTIVE SERVICE
                    </span>


                    <h2>
                        Current Service
                    </h2>


                    <p>
                        View the service you are currently working on.
                    </p>

                </div>


                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (

                    <div className="current-service-alert">

                        <i className="ri-error-warning-line"></i>

                        <span>
                            {error}
                        </span>

                    </div>

                )}


                {/* =================================================
                    LOADING
                ================================================= */}

                {loading && (

                    <div className="current-service-message">

                        <i className="ri-loader-4-line"></i>

                        <span>
                            Loading current service...
                        </span>

                    </div>

                )}


                {/* =================================================
                    NO ACTIVE SERVICE
                ================================================= */}

                {!loading &&
                !error &&
                !currentService && (

                    <div className="current-service-content">

                        <div className="current-service-empty">

                            <div className="current-service-empty-icon">

                                <i className="ri-tools-line"></i>

                            </div>


                            <h3>
                                No Active Service
                            </h3>


                            <p>
                                You currently have no service in progress.
                            </p>

                        </div>

                    </div>

                )}


                {/* =================================================
                    ACTIVE SERVICE
                ================================================= */}

                {!loading &&
                !error &&
                currentService && (

                    <div className="current-service-content">

                        <div className="current-service-card">


                            {/* =================================================
                                CARD HEADER
                            ================================================= */}

                            <div className="current-service-card-header">

                                <div className="current-service-vehicle">

                                    <div className="current-service-vehicle-icon">

                                        <i className="ri-car-line"></i>

                                    </div>


                                    <div>

                                        <span className="current-service-small-label">
                                            VEHICLE
                                        </span>


                                        <h3>

                                            {
                                                getVehicleName(
                                                    currentService
                                                )
                                            }

                                        </h3>


                                        <span className="booking-number">

                                            Booking #

                                            {
                                                getBookingId(
                                                    currentService
                                                )
                                            }

                                        </span>

                                    </div>

                                </div>


                                {/* STATUS */}

                                <div className="current-service-status">

                                    <span className="status-dot"></span>

                                    In Progress

                                </div>

                            </div>


                            {/* =================================================
                                SERVICE DETAILS
                            ================================================= */}

                            <div className="current-service-details">


                                {/* SERVICE */}

                                <div className="current-service-detail">

                                    <div className="detail-icon">

                                        <i className="ri-tools-line"></i>

                                    </div>


                                    <div>

                                        <span>
                                            Service
                                        </span>


                                        <strong>

                                            {
                                                getServiceName(
                                                    currentService
                                                )
                                            }

                                        </strong>

                                    </div>

                                </div>


                                {/* CUSTOMER */}

                                <div className="current-service-detail">

                                    <div className="detail-icon">

                                        <i className="ri-user-line"></i>

                                    </div>


                                    <div>

                                        <span>
                                            Customer
                                        </span>


                                        <strong>

                                            {
                                                getCustomerName(
                                                    currentService
                                                )
                                            }

                                        </strong>

                                    </div>

                                </div>


                                {/* PHONE */}

                                <div className="current-service-detail">

                                    <div className="detail-icon">

                                        <i className="ri-phone-line"></i>

                                    </div>


                                    <div>

                                        <span>
                                            Contact
                                        </span>


                                        <strong>

                                            {
                                                getCustomerPhone(
                                                    currentService
                                                )
                                            }

                                        </strong>

                                    </div>

                                </div>


                                {/* DATE */}

                                <div className="current-service-detail">

                                    <div className="detail-icon">

                                        <i className="ri-calendar-line"></i>

                                    </div>


                                    <div>

                                        <span>
                                            Booking Date
                                        </span>


                                        <strong>

                                            {
                                                formatDate(
                                                    currentService.bookingDate
                                                )
                                            }

                                        </strong>

                                    </div>

                                </div>


                                {/* TIME */}

                                <div className="current-service-detail">

                                    <div className="detail-icon">

                                        <i className="ri-time-line"></i>

                                    </div>


                                    <div>

                                        <span>
                                            Time
                                        </span>


                                        <strong>

                                            {
                                                currentService.bookingTime ||
                                                "N/A"
                                            }

                                        </strong>

                                    </div>

                                </div>


                            </div>


                            {/* =================================================
                                NOTES
                            ================================================= */}

                            {currentService.notes && (

                                <div className="current-service-notes">

                                    <div className="notes-icon">

                                        <i className="ri-file-text-line"></i>

                                    </div>


                                    <div>

                                        <span>
                                            Service Notes
                                        </span>


                                        <p>

                                            {
                                                currentService.notes
                                            }

                                        </p>

                                    </div>

                                </div>

                            )}


                        </div>

                    </div>

                )}

            </div>

        </section>

    );

};

export default CurrentService;