import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ServiceHistory.css";
import "remixicon/fonts/remixicon.css";
import API_BASE_URL from "../../../services/Api/api";

const BOOKING_API = `${API_BASE_URL}/api/booking`;

const ServiceHistory = ({ theme }) => {

    // =====================================================
    // STATES
    // =====================================================

    const [history, setHistory] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [selectedService, setSelectedService] = useState(null);


    // =====================================================
    // TOKEN
    // =====================================================

    const getToken = () => {
        return localStorage.getItem("token");
    };


    // =====================================================
    // FETCH MECHANIC SERVICES
    // =====================================================

    useEffect(() => {

        fetchServiceHistory();

    }, []);


    const fetchServiceHistory = async () => {

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
                        Authorization: `Bearer ${token}`
                    }
                }

            );


            console.log(
                "Mechanic Service History Response:",
                response.data
            );


            const bookings =
                response.data.bookings ||
                response.data.services ||
                response.data.data ||
                [];


            // =================================================
            // ONLY COMPLETED SERVICES
            // =================================================

            const completedServices =
                bookings.filter((booking) => {

                    return (
                        booking.status === "Completed"
                    );

                });


            setHistory(completedServices);


        } catch (err) {

            console.error(
                "Service History Error:",
                err.response?.data || err.message
            );


            setError(
                err.response?.data?.message ||
                "Unable to fetch service history."
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
    // GET CUSTOMER NAME
    // =====================================================

    const getCustomerName = (service) => {

        if (service.userId?.name) {

            return service.userId.name;

        }


        if (service.customerId?.name) {

            return service.customerId.name;

        }


        if (service.customer?.name) {

            return service.customer.name;

        }


        if (service.user?.name) {

            return service.user.name;

        }


        return "Customer";

    };


    // =====================================================
    // GET VEHICLE NAME
    // =====================================================

    const getVehicleName = (service) => {

        if (
            service.vehicleId &&
            typeof service.vehicleId === "object"
        ) {

            const vehicle =
                service.vehicleId;


            const brand =
                vehicle.brand || "";


            const model =
                vehicle.model || "";


            const vehicleName =
                `${brand} ${model}`.trim();


            if (vehicleName) {

                return vehicleName;

            }


            return (
                vehicle.vehicleName ||
                vehicle.name ||
                "Vehicle"
            );

        }


        if (
            service.vehicle?.brand ||
            service.vehicle?.model
        ) {

            return (

                `${service.vehicle.brand || ""} ` +
                `${service.vehicle.model || ""}`

            ).trim();

        }


        return "Vehicle";

    };


    // =====================================================
    // GET SERVICE NAME
    // =====================================================

    const getServiceName = (service) => {

        if (
            service.serviceId &&
            typeof service.serviceId === "object"
        ) {

            return (

                service.serviceId.serviceName ||
                service.serviceId.name ||
                "Vehicle Service"

            );

        }


        if (
            service.service?.serviceName
        ) {

            return service.service.serviceName;

        }


        if (service.serviceName) {

            return service.serviceName;

        }


        return "Vehicle Service";

    };


    // =====================================================
    // GET BOOKING ID
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
            className={`service-history ${theme || ""}`}
        >

            <div className="service-history-container">


                {/* =================================================
                    HEADING
                ================================================= */}

                <div className="service-history-heading">

                    <span className="dashboard-tag">
                        WORK HISTORY
                    </span>


                    <h2>
                        Service History
                    </h2>


                    <p>
                        View the services you have completed for customers.
                    </p>

                </div>


                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (

                    <div className="service-history-alert">

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

                    <div className="service-history-message">

                        <i className="ri-loader-4-line"></i>

                        <span>
                            Loading service history...
                        </span>

                    </div>

                )}


                {/* =================================================
                    EMPTY
                ================================================= */}

                {!loading &&
                !error &&
                history.length === 0 && (

                    <div className="service-history-content">

                        <div className="service-history-empty">

                            <div className="history-icon">

                                <i className="ri-history-line"></i>

                            </div>


                            <h3>
                                No Service History
                            </h3>


                            <p>
                                Your completed services will appear here.
                            </p>

                        </div>

                    </div>

                )}


                {/* =================================================
                    HISTORY LIST
                ================================================= */}

                {!loading &&
                history.length > 0 && (

                    <div className="service-history-list">

                        {history.map((service) => (

                            <div
                                className="history-service-card"
                                key={service._id}
                            >


                                {/* =================================================
                                    CARD HEADER
                                ================================================= */}

                                <div className="history-card-header">

                                    <div className="history-vehicle">

                                        <div className="history-vehicle-icon">

                                            <i className="ri-car-line"></i>

                                        </div>


                                        <div>

                                            <h3>

                                                {
                                                    getVehicleName(
                                                        service
                                                    )
                                                }

                                            </h3>


                                            <span>

                                                Booking #

                                                {
                                                    getBookingId(
                                                        service
                                                    )
                                                }

                                            </span>

                                        </div>

                                    </div>


                                    <div className="history-completed-status">

                                        <i className="ri-checkbox-circle-line"></i>

                                        Completed

                                    </div>

                                </div>


                                {/* =================================================
                                    DETAILS
                                ================================================= */}

                                <div className="history-card-details">


                                    {/* CUSTOMER */}

                                    <div className="history-detail">

                                        <span>

                                            <i className="ri-user-line"></i>

                                            Customer

                                        </span>


                                        <strong>

                                            {
                                                getCustomerName(
                                                    service
                                                )
                                            }

                                        </strong>

                                    </div>


                                    {/* SERVICE */}

                                    <div className="history-detail">

                                        <span>

                                            <i className="ri-tools-line"></i>

                                            Service

                                        </span>


                                        <strong>

                                            {
                                                getServiceName(
                                                    service
                                                )
                                            }

                                        </strong>

                                    </div>


                                    {/* DATE */}

                                    <div className="history-detail">

                                        <span>

                                            <i className="ri-calendar-line"></i>

                                            Date

                                        </span>


                                        <strong>

                                            {
                                                formatDate(
                                                    service.bookingDate
                                                )
                                            }

                                        </strong>

                                    </div>


                                    {/* TIME */}

                                    <div className="history-detail">

                                        <span>

                                            <i className="ri-time-line"></i>

                                            Time

                                        </span>


                                        <strong>

                                            {
                                                service.bookingTime ||
                                                "N/A"
                                            }

                                        </strong>

                                    </div>

                                </div>


                                {/* =================================================
                                    ACTION
                                ================================================= */}

                                <div className="history-card-action">

                                    <button
                                        type="button"
                                        className="history-view-btn"
                                        onClick={() =>
                                            setSelectedService(
                                                service
                                            )
                                        }
                                    >

                                        <i className="ri-eye-line"></i>

                                        View Details

                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>


            {/* =====================================================
                DETAILS MODAL
            ===================================================== */}

            {selectedService && (

                <div
                    className="history-details-overlay"
                    onMouseDown={(e) => {

                        if (
                            e.target === e.currentTarget
                        ) {

                            setSelectedService(null);

                        }

                    }}
                >

                    <div className="history-details-modal">


                        {/* =================================================
                            MODAL HEADER
                        ================================================= */}

                        <div className="history-modal-header">

                            <div>

                                <span>
                                    COMPLETED SERVICE
                                </span>


                                <h3>

                                    {
                                        getVehicleName(
                                            selectedService
                                        )
                                    }

                                </h3>

                            </div>


                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedService(null)
                                }
                            >

                                <i className="ri-close-line"></i>

                            </button>

                        </div>


                        {/* =================================================
                            MODAL DETAILS
                        ================================================= */}

                        <div className="history-modal-details">


                            {/* CUSTOMER */}

                            <div className="history-modal-detail">

                                <span>
                                    Customer
                                </span>


                                <strong>

                                    {
                                        getCustomerName(
                                            selectedService
                                        )
                                    }

                                </strong>

                            </div>


                            {/* SERVICE */}

                            <div className="history-modal-detail">

                                <span>
                                    Service
                                </span>


                                <strong>

                                    {
                                        getServiceName(
                                            selectedService
                                        )
                                    }

                                </strong>

                            </div>


                            {/* BOOKING ID */}

                            <div className="history-modal-detail">

                                <span>
                                    Booking ID
                                </span>


                                <strong>

                                    #
                                    {
                                        getBookingId(
                                            selectedService
                                        )
                                    }

                                </strong>

                            </div>


                            {/* DATE */}

                            <div className="history-modal-detail">

                                <span>
                                    Date
                                </span>


                                <strong>

                                    {
                                        formatDate(
                                            selectedService.bookingDate
                                        )
                                    }

                                </strong>

                            </div>


                            {/* TIME */}

                            <div className="history-modal-detail">

                                <span>
                                    Time
                                </span>


                                <strong>

                                    {
                                        selectedService.bookingTime ||
                                        "N/A"
                                    }

                                </strong>

                            </div>


                            {/* STATUS */}

                            <div className="history-modal-detail full-width">

                                <span>
                                    Status
                                </span>


                                <strong className="history-modal-status">

                                    <i className="ri-checkbox-circle-line"></i>

                                    Completed

                                </strong>

                            </div>


                            {/* NOTES */}

                            {selectedService.notes && (

                                <div className="history-modal-detail full-width">

                                    <span>
                                        Service Notes
                                    </span>


                                    <p>

                                        {
                                            selectedService.notes
                                        }

                                    </p>

                                </div>

                            )}

                        </div>


                        {/* =================================================
                            CLOSE
                        ================================================= */}

                        <div className="history-modal-footer">

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedService(null)
                                }
                            >

                                Close

                            </button>

                        </div>

                    </div>

                </div>

            )}

        </section>

    );

};

export default ServiceHistory;