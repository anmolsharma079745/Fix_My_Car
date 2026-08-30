import React, { useEffect, useState } from "react";
import axios from "axios";
import "./UpcomingServices.css";
import API_BASE_URL from "../../../services/Api/api";

const UpcomingService = ({ theme }) => {

    const [upcomingService, setUpcomingService] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    const [showReschedule, setShowReschedule] = useState(false);
    const [newBookingDate, setNewBookingDate] = useState("");
    const [rescheduleLoading, setRescheduleLoading] = useState(false);


    const [showDetails, setShowDetails] = useState(false);



    const fetchUpcomingService = async (showLoader = false) => {

        try {

            if (showLoader) {
                setLoading(true);
            }

            setError("");

            const token = localStorage.getItem("token");

            if (!token) {
                setError("Customer login token not found.");
                return;
            }

            const response = await axios.get(
                `${API_BASE_URL}/api/booking/upcoming`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const bookings = response.data.bookings || [];

            if (bookings.length > 0) {

                setUpcomingService(bookings[0]);

                console.log(
                    "Upcoming Service:",
                    bookings[0]
                );

                console.log(
                    "Vehicle Data:",
                    bookings[0]?.vehicleId
                );

                console.log(
                    "Vehicle Image:",
                    bookings[0]?.vehicleId?.image
                );

            } else {

                setUpcomingService(null);

            }

        } catch (error) {

            console.error(
                "Upcoming Service Error:",
                error.response?.data || error.message
            );

            if (!upcomingService) {

                setError(
                    error.response?.data?.message ||
                    "Unable to fetch upcoming service."
                );

            }

        } finally {

            if (showLoader) {
                setLoading(false);
            }

        }

    };



    useEffect(() => {

        fetchUpcomingService(true);

    }, []);



    useEffect(() => {

        const refreshInterval = setInterval(() => {

            fetchUpcomingService(false);

        }, 5000);


        const handleVisibilityChange = () => {

            if (!document.hidden) {

                fetchUpcomingService(false);

            }

        };

        document.addEventListener(
            "visibilitychange",
            handleVisibilityChange
        );


        return () => {

            clearInterval(refreshInterval);

            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );

        };

    }, []);


const getMinBookingDateTime = () => {

    const now = new Date();

    now.setMinutes(now.getMinutes() + 1);

    const year = now.getFullYear();

    const month = String(
        now.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        now.getDate()
    ).padStart(2, "0");

    const hours = String(
        now.getHours()
    ).padStart(2, "0");

    const minutes = String(
        now.getMinutes()
    ).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const minRescheduleDateTime =
    getMinBookingDateTime();



    const formatDate = (date) => {

        if (!date) {
            return "N/A";
        }

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    };



    const formatTime = (time) => {

    if (!time) {
        return "N/A";
    }

    try {

        const [hours, minutes] = time.split(":");

        const date = new Date();

        date.setHours(
            Number(hours),
            Number(minutes),
            0,
            0
        );

        return date.toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
            }
        );

    } catch {

        return time;

    }

};



    const formatStatus = (status) => {

        if (!status) {
            return "Pending";
        }


        return status
            .toString()
            .replace(/[-_]/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase());

    };



    const handleOpenDetails = () => {

        setError("");
        setSuccess("");

        fetchUpcomingService(false);

        setShowDetails(true);

    };



    const handleCloseDetails = () => {

        setShowDetails(false);

    };



    const handleOpenReschedule = () => {

    setError("");
    setSuccess("");

    if (
        upcomingService?.bookingDate &&
        upcomingService?.bookingTime
    ) {

        const date = new Date(upcomingService.bookingDate);

        const year = date.getFullYear();

        const month = String(
            date.getMonth() + 1
        ).padStart(2, "0");

        const day = String(
            date.getDate()
        ).padStart(2, "0");

        const [hours, minutes] =
            upcomingService.bookingTime.split(":");

        setNewBookingDate(
            `${year}-${month}-${day}T${hours}:${minutes}`
        );

    }

    setShowReschedule(true);
};


    const handleCloseReschedule = () => {

        if (rescheduleLoading) {
            return;
        }

        setShowReschedule(false);
        setNewBookingDate("");

    };



    const handleReschedule = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        if (!newBookingDate) {

            setError(
                "Please select a new date and time."
            );

            return;
        }

        try {

            setRescheduleLoading(true);

            const token = localStorage.getItem("token");

            if (!token) {

                setError(
                    "Customer login token not found."
                );

                return;
            }

            const [date, time] = newBookingDate.split("T");

const response = await axios.put(

    `${API_BASE_URL}/api/booking/reschedule/${upcomingService._id}`,

    {
        bookingDate: date,
        bookingTime: time
    },

    {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

);


            console.log(
                "Reschedule Response:",
                response.data
            );



            if (response.data.booking) {

                setUpcomingService(
                    response.data.booking
                );

            }


            setSuccess(
                "Booking rescheduled successfully!"
            );

            setShowReschedule(false);

            setNewBookingDate("");



            fetchUpcomingService(false);


        } catch (error) {

            console.error(
                "Reschedule Error:",
                error.response?.data || error.message
            );

            setError(
                error.response?.data?.message ||
                "Unable to reschedule booking."
            );

        } finally {

            setRescheduleLoading(false);

        }

    };



    if (loading) {

        return (

            <section
                className={`upcoming-service ${theme}`}
            >

                <div className="upcoming-header">

                    <div>

                        <p className="section-label">
                            YOUR NEXT SERVICE
                        </p>

                        <h2>
                            Upcoming Service
                        </h2>

                        <p className="section-description">
                            Here is your next scheduled vehicle service.
                        </p>

                    </div>

                </div>

                <div className="upcoming-card">

                    <div className="booking-message">

                        <i className="ri-loader-4-line"></i>

                        <span>
                            Loading upcoming service...
                        </span>

                    </div>

                </div>

            </section>

        );

    }



    if (error && !upcomingService) {

        return (

            <section
                className={`upcoming-service ${theme}`}
            >

                <div className="upcoming-header">

                    <div>

                        <p className="section-label">
                            YOUR NEXT SERVICE
                        </p>

                        <h2>
                            Upcoming Service
                        </h2>

                        <p className="section-description">
                            Here is your next scheduled vehicle service.
                        </p>

                    </div>

                </div>

                <div className="upcoming-card">

                    <div className="booking-message error-message">

                        <i className="ri-error-warning-line"></i>

                        <span>
                            {error}
                        </span>

                    </div>

                </div>

            </section>

        );

    }



    if (!upcomingService) {

        return (

            <section
                className={`upcoming-service ${theme}`}
            >

                <div className="upcoming-header">

                    <div>

                        <p className="section-label">
                            YOUR NEXT SERVICE
                        </p>

                        <h2>
                            Upcoming Service
                        </h2>

                        <p className="section-description">
                            Here is your next scheduled vehicle service.
                        </p>

                    </div>

                </div>

                <div className="upcoming-card">

                    <div className="booking-message">

                        <i className="ri-calendar-close-line"></i>

                        <span>
                            No upcoming service found.
                        </span>

                    </div>

                </div>

            </section>

        );

    }



    return (

        <section
            className={`upcoming-service ${theme}`}
        >


            <div className="upcoming-header">

                <div>

                    <p className="section-label">
                        YOUR NEXT SERVICE
                    </p>

                    <h2>
                        Upcoming Service
                    </h2>

                    <p className="section-description">
                        Here is your next scheduled vehicle service.
                    </p>

                </div>

                <span
                    className={`service-status status-${String(
                        upcomingService.status || "pending"
                    )
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                >

                    <span className="status-dot"></span>

                    {formatStatus(
                        upcomingService.status
                    )}

                </span>

            </div>



            {success && (

                <div className="booking-message success-message">

                    <i className="ri-checkbox-circle-line"></i>

                    <span>
                        {success}
                    </span>

                </div>

            )}



            {error && (

                <div className="booking-message error-message">

                    <i className="ri-error-warning-line"></i>

                    <span>
                        {error}
                    </span>

                </div>

            )}



            <div className="upcoming-card">



                <div className="vehicle-section">

                    <div className="vehicle-icon">

                        {upcomingService.vehicleId?.vehicleImage ? (

                            <img
                                src={upcomingService.vehicleId.vehicleImage}
                                alt={
                                    upcomingService.vehicleId?.vehicleName ||
                                    "Vehicle"
                                }
                            />

                        ) : (

                            <i
                                className={
                                    upcomingService.vehicleId?.vehicleType === "Bike"
                                        ? "ri-motorbike-line"
                                        : "ri-car-line"
                                }
                            ></i>

                        )}

                    </div>

                    <div className="vehicle-info">

                        <span className="info-label">
                            VEHICLE
                        </span>

                        <h3>
                            {
                                upcomingService.vehicleId?.vehicleName ||
                                "Vehicle"
                            }
                        </h3>

                        <p>
                            {
                                upcomingService.vehicleId?.numberPlate ||
                                "N/A"
                            }
                        </p>

                    </div>

                </div>



                <div className="service-details">


                    <div className="detail-item">

                        <span className="detail-icon">
                            🔧
                        </span>

                        <div>

                            <span className="detail-label">
                                SERVICE
                            </span>

                            <strong>
                                {
                                    upcomingService.serviceId?.serviceName ||
                                    "N/A"
                                }
                            </strong>

                        </div>

                    </div>


                    <div className="detail-item">

                        <span className="detail-icon">
                            📅
                        </span>

                        <div>

                            <span className="detail-label">
                                DATE
                            </span>

                            <strong>
                                {formatDate(
                                    upcomingService.bookingDate
                                )}
                            </strong>

                        </div>

                    </div>


                    <div className="detail-item">

                        <span className="detail-icon">
                            ⏰
                        </span>

                        <div>

                            <span className="detail-label">
                                TIME
                            </span>

                            <strong>
    {formatTime(
        upcomingService.bookingTime
    )}
</strong>

                        </div>

                    </div>


                    <div className="detail-item">

                        <span className="detail-icon">
                            👨‍🔧
                        </span>

                        <div>

                            <span className="detail-label">
                                MECHANIC
                            </span>

                            <strong>
                                {
                                    upcomingService.mechanicId?.name ||
                                    "Not Assigned"
                                }
                            </strong>

                        </div>

                    </div>

                </div>



                <div className="service-location">

                    <span className="location-icon">
                        📋
                    </span>

                    <div>

                        <span className="detail-label">
                            BOOKING STATUS
                        </span>

                        <p>
                            Your service booking is currently{" "}
                            <strong>
                                {formatStatus(
                                    upcomingService.status
                                )}
                            </strong>.
                        </p>

                    </div>

                </div>



                <div className="service-actions">

                    <button
                        className="view-details-btn"
                        type="button"
                        onClick={handleOpenDetails}
                    >
                        <i className="ri-eye-line"></i>
                        View Details
                    </button>

                    <button
                        className="reschedule-btn"
                        type="button"
                        onClick={handleOpenReschedule}
                    >
                        <i className="ri-calendar-edit-line"></i>
                        Reschedule
                    </button>

                </div>

            </div>



            {showDetails && (

                <div
                    className="details-overlay"
                    onClick={handleCloseDetails}
                >

                    <div
                        className="details-modal"
                        onClick={(e) => e.stopPropagation()}
                    >


                        <div className="details-modal-header">

                            <div>

                                <span className="details-label">
                                    BOOKING INFORMATION
                                </span>

                                <h3>
                                    Service Details
                                </h3>

                                <p>
                                    Complete information about your upcoming service.
                                </p>

                            </div>


                            <button
                                type="button"
                                className="close-details-btn"
                                onClick={handleCloseDetails}
                            >

                                <i className="ri-close-line"></i>

                            </button>

                        </div>



                        <div className="details-modal-body">



                            <div className="modal-detail-card">

                                <div className="modal-detail-icon">

                                    {
                                        upcomingService.vehicleId?.vehicleType === "Bike"
                                            ? "🏍️"
                                            : "🚗"
                                    }

                                </div>

                                <div>

                                    <span>
                                        VEHICLE
                                    </span>

                                    <strong>
                                        {
                                            upcomingService.vehicleId?.vehicleName ||
                                            "Vehicle"
                                        }
                                    </strong>

                                    <small>
                                        {
                                            upcomingService.vehicleId?.numberPlate ||
                                            "N/A"
                                        }
                                    </small>

                                </div>

                            </div>



                            <div className="details-grid">


                                <div className="modal-detail-item">

                                    <i className="ri-tools-line"></i>

                                    <div>

                                        <span>
                                            SERVICE
                                        </span>

                                        <strong>
                                            {
                                                upcomingService.serviceId?.serviceName ||
                                                "N/A"
                                            }
                                        </strong>

                                    </div>

                                </div>


                                <div className="modal-detail-item">

                                    <i className="ri-calendar-line"></i>

                                    <div>

                                        <span>
                                            DATE
                                        </span>

                                        <strong>
                                            {
                                                formatDate(
                                                    upcomingService.bookingDate
                                                )
                                            }
                                        </strong>

                                    </div>

                                </div>


                                <div className="modal-detail-item">

                                    <i className="ri-time-line"></i>

                                    <div>

                                        <span>
                                            TIME
                                        </span>

                                        <strong>
    {
        formatTime(
            upcomingService.bookingTime
        )
    }
</strong>

                                    </div>

                                </div>


                                <div className="modal-detail-item">

                                    <i className="ri-user-settings-line"></i>

                                    <div>

                                        <span>
                                            MECHANIC
                                        </span>

                                        <strong>
                                            {
                                                upcomingService.mechanicId?.name ||
                                                "Not Assigned"
                                            }
                                        </strong>

                                    </div>

                                </div>


                                <div className="modal-detail-item">

                                    <i className="ri-checkbox-circle-line"></i>

                                    <div>

                                        <span>
                                            STATUS
                                        </span>

                                        <strong>
                                            {
                                                formatStatus(
                                                    upcomingService.status
                                                )
                                            }
                                        </strong>

                                    </div>

                                </div>


                                <div className="modal-detail-item">

                                    <i className="ri-file-list-3-line"></i>

                                    <div>

                                        <span>
                                            BOOKING ID
                                        </span>

                                        <strong className="booking-id">
                                            {
                                                upcomingService._id ||
                                                "N/A"
                                            }
                                        </strong>

                                    </div>

                                </div>

                            </div>

                        </div>



                        <div className="details-modal-actions">

                            <button
                                type="button"
                                className="modal-action-btn"
                                onClick={handleCloseDetails}
                            >
                                Close
                            </button>


                            <button
                                type="button"
                                className="modal-action-btn primary"
                                onClick={() => {

                                    handleCloseDetails();

                                    handleOpenReschedule();

                                }}
                            >

                                <i className="ri-calendar-edit-line"></i>

                                Reschedule

                            </button>

                        </div>

                    </div>

                </div>

            )}



            {showReschedule && (

                <div
                    className="reschedule-overlay"
                    onClick={handleCloseReschedule}
                >

                    <div
                        className="reschedule-modal"
                        onClick={(e) => e.stopPropagation()}
                    >


                        <div className="reschedule-modal-header">

                            <div>

                                <span className="reschedule-label">
                                    CHANGE SCHEDULE
                                </span>

                                <h3>
                                    Reschedule Service
                                </h3>

                                <p>
                                    Select a new date and time for your service.
                                </p>

                            </div>


                            <button
                                type="button"
                                className="close-reschedule-btn"
                                onClick={handleCloseReschedule}
                                disabled={rescheduleLoading}
                            >

                                <i className="ri-close-line"></i>

                            </button>

                        </div>



                        <form
                            className="reschedule-form"
                            onSubmit={handleReschedule}
                        >

                            <label htmlFor="newBookingDate">

                                <i className="ri-calendar-line"></i>

                                New Date & Time

                            </label>


                            <input
                                type="datetime-local"
    
    id="newBookingDate"
    value={newBookingDate}
    onChange={(e) => {

        setNewBookingDate(
            e.target.value
        );

        setError("");

    }}
    min={minRescheduleDateTime}
    required
                            />


                            <div className="reschedule-modal-actions">

                                <button
                                    type="button"
                                    className="cancel-reschedule-btn"
                                    onClick={handleCloseReschedule}
                                    disabled={rescheduleLoading}
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="confirm-reschedule-btn"
                                    disabled={rescheduleLoading}
                                >

                                    {rescheduleLoading ? (

                                        <>
                                            <i className="ri-loader-4-line"></i>

                                            Rescheduling...
                                        </>

                                    ) : (

                                        <>
                                            <i className="ri-calendar-check-line"></i>

                                            Confirm Reschedule
                                        </>

                                    )}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </section>

    );

};

export default UpcomingService;
