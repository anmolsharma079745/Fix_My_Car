import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import "./CurrentBooking.css";

const CurrentBooking = ({ theme }) => {

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [paymentBookingId, setPaymentBookingId] = useState(null);


    // =====================================================
    // FETCH CURRENT BOOKINGS
    // =====================================================

    const fetchCurrentBooking = useCallback(async (showLoading = false) => {

        try {

            if (showLoading) {
                setLoading(true);
            }

            setError("");

            const token = localStorage.getItem("token");

            if (!token) {

                setError("Customer login token not found.");

                setLoading(false);

                return;
            }


            const response = await axios.get(
                "http://localhost:5000/api/booking/all",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );


            console.log(
                "Customer Bookings:",
                response.data
            );


            const allBookings =
                response.data?.bookings || [];


            // =================================================
            // FILTER CURRENT BOOKINGS
            //
            // MAXIMUM 3 BOOKINGS
            //
            // pending
            // confirmed
            // In Progress
            // Completed + payment pending
            //
            // Completed + paid will not appear.
            // =================================================

            const activeBookings = allBookings
                .filter((item) => {

                    const status =
                        item.status?.toLowerCase().trim();

                    const paymentStatus =
                        item.paymentStatus?.toLowerCase().trim();


                    if (
                        status === "pending" ||
                        status === "confirmed" ||
                        status === "in progress"
                    ) {

                        return true;

                    }


                    if (
                        status === "completed" &&
                        paymentStatus !== "paid"
                    ) {

                        return true;

                    }


                    return false;

                })


                // =================================================
                // SORT LATEST BOOKINGS FIRST
                // =================================================

                .sort((a, b) => {

                    const dateA =
                        new Date(
                            `${a.bookingDate || ""}T${a.bookingTime || "00:00"}`
                        ).getTime();

                    const dateB =
                        new Date(
                            `${b.bookingDate || ""}T${b.bookingTime || "00:00"}`
                        ).getTime();


                    if (dateB !== dateA) {
                        return dateB - dateA;
                    }


                    return (
                        new Date(b.createdAt || 0).getTime() -
                        new Date(a.createdAt || 0).getTime()
                    );

                })


                // =================================================
                // ONLY 3 BOOKINGS
                // =================================================

                .slice(0, 3);


            console.log(
                "Current Active Bookings:",
                activeBookings
            );


            setBookings(activeBookings);


        } catch (error) {

            console.error(
                "Current Booking Error:",
                error.response?.data || error.message
            );


            if (error.response?.status === 403) {

                setError(
                    "Access Denied! Your account does not have permission to view bookings."
                );

            } else if (error.response?.status === 401) {

                setError(
                    "Your login session has expired. Please login again."
                );

            } else {

                setError(
                    error.response?.data?.message ||
                    "Unable to fetch current bookings."
                );

            }

        } finally {

            setLoading(false);

        }

    }, []);


    // =====================================================
    // INITIAL FETCH + AUTO REFRESH
    // =====================================================

    useEffect(() => {

        fetchCurrentBooking(true);


        const interval = setInterval(() => {

            fetchCurrentBooking(false);

        }, 5000);


        return () => {

            clearInterval(interval);

        };

    }, [fetchCurrentBooking]);


    // =====================================================
    // PAY NOW
    // =====================================================

    const handlePayment = async (booking) => {

        try {

            setPaymentLoading(true);

            setPaymentBookingId(booking._id);

            setError("");


            const token =
                localStorage.getItem("token");


            if (!token) {

                setError(
                    "Customer login token not found."
                );

                return;

            }


            // =================================================
            // CHECK RAZORPAY
            // =================================================

            if (
                typeof window.Razorpay ===
                "undefined"
            ) {

                setError(
                    "Razorpay SDK not loaded. Please refresh the page."
                );

                return;

            }


            // =================================================
            // CREATE PAYMENT ORDER
            // =================================================

            const response =
                await axios.post(

                    "http://localhost:5000/api/payment/create-order",

                    {
                        bookingId: booking._id
                    },

                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }

                );


            console.log(
                "Payment Order:",
                response.data
            );


            const {
                razorpayOrderId,
                amount,
                currency,
                keyId
            } = response.data;


            if (
                !razorpayOrderId ||
                !amount ||
                !currency ||
                !keyId
            ) {

                setError(
                    "Invalid payment order details received from server."
                );

                return;

            }


            // =================================================
            // RAZORPAY OPTIONS
            // =================================================

            const options = {

                key: keyId,

                amount:
                    Math.round(
                        Number(amount) * 100
                    ),

                currency,

                name:
                    "Fix My Ride",

                description:
                    booking.serviceId?.serviceName ||
                    booking.serviceId?.name ||
                    "Vehicle Service",

                order_id:
                    razorpayOrderId,


                // =================================================
                // PREFILL CUSTOMER
                // =================================================

                prefill: {

                    name:
                        localStorage.getItem(
                            "userName"
                        ) || "",

                    email:
                        localStorage.getItem(
                            "userEmail"
                        ) || "",

                    contact:
                        localStorage.getItem(
                            "userPhone"
                        ) || ""

                },


                // =================================================
                // PAYMENT SUCCESS
                // =================================================

                handler: async function (
                    paymentResponse
                ) {

                    try {

                        console.log(
                            "Razorpay Payment Response:",
                            paymentResponse
                        );


                        const verifyResponse =
                            await axios.post(

                                "http://localhost:5000/api/payment/verify",

                                {

                                    razorpay_order_id:
                                        paymentResponse.razorpay_order_id,

                                    razorpay_payment_id:
                                        paymentResponse.razorpay_payment_id,

                                    razorpay_signature:
                                        paymentResponse.razorpay_signature

                                },

                                {

                                    headers: {

                                        Authorization:
                                            `Bearer ${token}`

                                    }

                                }

                            );


                        console.log(
                            "Payment Verification:",
                            verifyResponse.data
                        );


                        alert(
                            "Payment successful! Your receipt has been sent to your email."
                        );


                        await fetchCurrentBooking(true);


                    } catch (error) {

                        console.error(
                            "Payment Verification Error:",
                            error.response?.data ||
                            error.message
                        );


                        setError(

                            error.response?.data?.message ||

                            "Payment verification failed."

                        );

                    }

                },


                // =================================================
                // PAYMENT MODAL CLOSED
                // =================================================

                modal: {

                    ondismiss: function () {

                        console.log(
                            "Payment window closed."
                        );

                    }

                },


                // =================================================
                // RAZORPAY THEME
                // =================================================

                theme: {

                    color:
                        theme === "dark"
                            ? "#3b82f6"
                            : "#2563eb",

                    backdrop_color:
                        theme === "dark"
                            ? "#0f172a"
                            : "#f8fafc"

                }

            };


            // =================================================
            // CREATE RAZORPAY INSTANCE
            // =================================================

            const razorpayInstance =
                new window.Razorpay(options);


            // =================================================
            // PAYMENT FAILED
            // =================================================

            razorpayInstance.on(
                "payment.failed",
                function (paymentError) {

                    console.error(
                        "Razorpay Payment Failed:",
                        paymentError
                    );


                    setError(

                        paymentError.error?.description ||

                        "Payment failed. Please try again."

                    );

                }
            );


            razorpayInstance.open();


        } catch (error) {

            console.error(
                "Payment Error:",
                error.response?.data ||
                error.message
            );


            setError(

                error.response?.data?.message ||

                "Unable to start payment."

            );

        } finally {

            setPaymentLoading(false);

            setPaymentBookingId(null);

        }

    };


    // =====================================================
    // FORMAT DATE
    // =====================================================

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


    // =====================================================
    // FORMAT TIME
    // =====================================================

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

    // =====================================================
    // FORMAT STATUS
    // =====================================================

    const formatStatus = (status) => {

        if (!status) {
            return "Pending";
        }


        const normalizedStatus =
            status.toLowerCase().trim();


        switch (normalizedStatus) {

            case "pending":
                return "Pending";

            case "confirmed":
                return "Confirmed";

            case "in progress":
                return "In Progress";

            case "completed":
                return "Completed";

            case "cancelled":
                return "Cancelled";

            default:

                return (
                    status.charAt(0).toUpperCase() +
                    status.slice(1)
                );

        }

    };


    // =====================================================
    // STATUS CLASS
    // =====================================================

    const getStatusClass = (status) => {

        if (!status) {
            return "pending";
        }


        return status
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-");

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <section
                className={`current-booking ${theme}`}
            >

                <div className="current-booking-header">

                    <div>

                        <span className="current-booking-tag">
                            ACTIVE SERVICE
                        </span>

                        <h2>
                            Current Booking
                        </h2>

                        <p>
                            Track your current vehicle service bookings.
                        </p>

                    </div>

                </div>


                <div className="current-booking-card">

                    <div className="booking-message">

                        <i className="ri-loader-4-line"></i>

                        <span>
                            Loading current bookings...
                        </span>

                    </div>

                </div>

            </section>

        );

    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error && bookings.length === 0) {

        return (

            <section
                className={`current-booking ${theme}`}
            >

                <div className="current-booking-header">

                    <div>

                        <span className="current-booking-tag">
                            ACTIVE SERVICE
                        </span>

                        <h2>
                            Current Booking
                        </h2>

                        <p>
                            Track your current vehicle service bookings.
                        </p>

                    </div>

                </div>


                <div className="current-booking-card">

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


    // =====================================================
    // NO CURRENT BOOKINGS
    // =====================================================

    if (bookings.length === 0) {

        return (

            <section
                id="current-booking"
                className={`current-booking ${theme}`}
            >

                <div className="current-booking-header">

                    <div>

                        <span className="current-booking-tag">
                            ACTIVE SERVICE
                        </span>

                        <h2>
                            Current Booking
                        </h2>

                        <p>
                            Track your current vehicle service bookings.
                        </p>

                    </div>

                </div>


                <div className="current-booking-card">

                    <div className="booking-message">

                        <i className="ri-calendar-close-line"></i>

                        <span>
                            No current booking found.
                        </span>

                    </div>

                </div>

            </section>

        );

    }


    // =====================================================
    // MAIN UI
    // =====================================================

    return (

        <section
            id="current-booking"
            className={`current-booking ${theme}`}
        >


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="current-booking-header">

                <div>

                    <span className="current-booking-tag">
                        ACTIVE SERVICE
                    </span>

                    <h2>
                        Current Booking
                    </h2>

                    <p>
                        Track your current vehicle service bookings.
                    </p>

                </div>


                {/* =================================================
                    BOOKING COUNT
                ================================================= */}

                <span className="current-booking-status pending">

                    <span className="status-dot"></span>

                    {bookings.length}{" "}

                    {bookings.length === 1
                        ? "Booking"
                        : "Bookings"}

                </span>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="booking-message error-message">

                    <i className="ri-error-warning-line"></i>

                    <span>
                        {error}
                    </span>

                </div>

            )}


            {/* =================================================
                CURRENT BOOKINGS
            ================================================= */}

            <div className="current-bookings-list">

                {bookings.map((booking) => {

                    const currentStatus =
                        formatStatus(
                            booking.status
                        );


                    const statusClass =
                        getStatusClass(
                            booking.status
                        );


                    // =================================================
                    // PAYMENT
                    // =================================================

                    const isCompleted =
                        booking.status
                            ?.toLowerCase()
                            .trim() ===
                        "completed";


                    const isPaymentPending =
                        booking.paymentStatus
                            ?.toLowerCase()
                            .trim() !==
                        "paid";


                    return (

                        <div
                            className="current-booking-card"
                            key={booking._id}
                        >


                            {/* =================================================
                                MAIN TOP STRUCTURE
                                
                                LEFT  = VEHICLE
                                RIGHT = BOOKING DETAILS
                            ================================================= */}

                            <div className="current-booking-main">


                                {/* =================================================
                                    LEFT - VEHICLE DETAILS
                                ================================================= */}

                                <div className="current-booking-vehicle-section">

                                    <div className="current-vehicle-icon">

                                        {booking.vehicleId?.vehicleImage ? (

                                            <img
                                                src={
                                                    booking.vehicleId.vehicleImage
                                                }
                                                alt={
                                                    booking.vehicleId?.vehicleName ||
                                                    "Vehicle"
                                                }
                                            />

                                        ) : (

                                            <i
                                                className={
                                                    booking.vehicleId?.vehicleType ===
                                                    "Bike"
                                                        ? "ri-motorbike-line"
                                                        : "ri-car-line"
                                                }
                                            ></i>

                                        )}

                                    </div>


                                    <div className="current-vehicle-info">

                                        <span className="detail-label">
                                            VEHICLE
                                        </span>


                                        <h3>
                                            {
                                                booking.vehicleId?.vehicleName ||
                                                "Vehicle"
                                            }
                                        </h3>


                                        <p>
                                            {
                                                booking.vehicleId?.model ||
                                                "N/A"
                                            }
                                        </p>


                                        <span className="vehicle-number">

                                            {
                                                booking.vehicleId?.numberPlate ||
                                                "N/A"
                                            }

                                        </span>

                                    </div>

                                </div>


                                {/* =================================================
                                    VERTICAL DIVIDER
                                ================================================= */}

                                <div className="current-booking-vertical-divider"></div>


                                {/* =================================================
                                    RIGHT - BOOKING DETAILS
                                ================================================= */}

                                <div className="current-booking-right-section">


                                    {/* =================================================
                                        BOOKING ID + STATUS
                                    ================================================= */}

                                    <div className="current-booking-card-header">

                                        <div>

                                            <span className="detail-label">
                                                BOOKING ID
                                            </span>

                                            <strong>
                                                #
                                                {booking._id
                                                    ?.slice(-6)
                                                    .toUpperCase()}
                                            </strong>

                                        </div>


                                        <span
                                            className={`current-booking-status ${statusClass}`}
                                        >

                                            <span className="status-dot"></span>

                                            {currentStatus}

                                        </span>

                                    </div>


                                    {/* =================================================
                                        DETAILS GRID
                                    ================================================= */}

                                    <div className="current-booking-details">


                                        {/* SERVICE */}

                                        <div className="current-detail">

                                            <div className="current-detail-icon">

                                                <i className="ri-tools-line"></i>

                                            </div>

                                            <div>

                                                <span className="detail-label">
                                                    SERVICE
                                                </span>

                                                <strong>
                                                    {
                                                        booking.serviceId?.serviceName ||
                                                        booking.serviceId?.name ||
                                                        "N/A"
                                                    }
                                                </strong>

                                            </div>

                                        </div>


                                        {/* DATE */}

                                        <div className="current-detail">

                                            <div className="current-detail-icon">

                                                <i className="ri-calendar-line"></i>

                                            </div>

                                            <div>

                                                <span className="detail-label">
                                                    BOOKING DATE
                                                </span>

                                                <strong>
                                                    {formatDate(
                                                        booking.bookingDate
                                                    )}
                                                </strong>

                                            </div>

                                        </div>


                                        {/* TIME */}

                                        <div className="current-detail">

                                            <div className="current-detail-icon">

                                                <i className="ri-time-line"></i>

                                            </div>

                                            <div>

                                                <span className="detail-label">
                                                    BOOKING TIME
                                                </span>

                                                <strong>
                                                    {formatTime(
                                                        booking.bookingTime
                                                    )}
                                                </strong>

                                            </div>

                                        </div>


                                        {/* MECHANIC */}

                                        <div className="current-detail">

                                            <div className="current-detail-icon">

                                                <i className="ri-user-settings-line"></i>

                                            </div>

                                            <div>

                                                <span className="detail-label">
                                                    MECHANIC
                                                </span>

                                                <strong>

                                                    {
                                                        booking.mechanicId?.name ||
                                                        "Not Assigned"
                                                    }

                                                </strong>

                                            </div>

                                        </div>


                                        {/* STATUS */}

                                        <div className="current-detail">

                                            <div className="current-detail-icon">

                                                <i className="ri-loader-line"></i>

                                            </div>

                                            <div>

                                                <span className="detail-label">
                                                    STATUS
                                                </span>

                                                <strong
                                                    className={`status-value ${statusClass}`}
                                                >
                                                    {currentStatus}
                                                </strong>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            </div>


                            {/* =================================================
                                SERVICE DESCRIPTION
                            ================================================= */}

                            {booking.serviceId?.description && (

                                <div className="current-service-description">

                                    <i className="ri-information-line"></i>

                                    <div>

                                        <span className="detail-label">
                                            SERVICE DETAILS
                                        </span>

                                        <p>
                                            {
                                                booking.serviceId.description
                                            }
                                        </p>

                                    </div>

                                </div>

                            )}


                            {/* =================================================
                                PAYMENT SECTION
                            ================================================= */}

                            {isCompleted &&
                                isPaymentPending && (

                                    <div className="current-payment-section">

                                        <div className="current-payment-info">

                                            <div className="current-payment-icon">

                                                <i className="ri-secure-payment-line"></i>

                                            </div>

                                            <div>

                                                <span className="detail-label">
                                                    PAYMENT REQUIRED
                                                </span>

                                                <strong>
                                                    Service Completed
                                                </strong>

                                                <p>
                                                    Please complete the payment to move this service to your Service History.
                                                </p>

                                            </div>

                                        </div>


                                        <button
                                            type="button"
                                            className="current-payment-button"
                                            onClick={() =>
                                                handlePayment(booking)
                                            }
                                            disabled={
                                                paymentLoading &&
                                                paymentBookingId ===
                                                booking._id
                                            }
                                        >

                                            {paymentLoading &&
                                            paymentBookingId ===
                                            booking._id ? (

                                                <>

                                                    <i className="ri-loader-4-line"></i>

                                                    Processing...

                                                </>

                                            ) : (

                                                <>

                                                    <i className="ri-bank-card-line"></i>

                                                    Pay Now

                                                </>

                                            )}

                                        </button>

                                    </div>

                                )}


                            {/* =================================================
                                PAYMENT COMPLETED
                            ================================================= */}

                            {isCompleted &&
                                !isPaymentPending && (

                                    <div className="current-payment-paid">

                                        <i className="ri-checkbox-circle-line"></i>

                                        <span>
                                            Payment Completed
                                        </span>

                                    </div>

                                )}

                        </div>

                    );

                })}

            </div>

        </section>

    );

};


export default CurrentBooking;
