import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ManageBookings.css";
import API_BASE_URL from "../../../services/Api/api";
const ManageBooking = ({ theme }) => {

    // =====================================================
    // STATES
    // =====================================================

    const [bookings, setBookings] = useState([]);
    const [mechanics, setMechanics] = useState([]);

    const [loading, setLoading] = useState(true);
    const [mechanicsLoading, setMechanicsLoading] = useState(true);

    const [error, setError] = useState("");
    const [mechanicsError, setMechanicsError] = useState("");

    const [editModal, setEditModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);

    const [selectedMechanic, setSelectedMechanic] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");

    const [deleteLoading, setDeleteLoading] = useState(false);
    const [assignLoading, setAssignLoading] = useState(false);
    const [statusLoading, setStatusLoading] = useState(false);


    // =====================================================
    // STATUS OPTIONS
    // =====================================================

    const statusOptions = [
        "pending",
        "confirmed",
        "In Progress",
        "Completed",
        "cancelled"
    ];


    // =====================================================
    // FETCH BOOKINGS + MECHANICS
    // =====================================================

    useEffect(() => {

        fetchBookings();
        fetchMechanics();

    }, []);


    // =====================================================
    // FETCH ALL BOOKINGS
    // =====================================================

    const fetchBookings = async () => {

        try {

            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            if (!token) {

                setError("Admin login token not found.");
                return;

            }

            const response = await axios.get(
                `${API_BASE_URL}/api/booking/admin/all`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log(
                "All Bookings Response:",
                response.data
            );

            setBookings(
                response.data?.bookings || []
            );

        } catch (error) {

            console.error(
                "Manage Booking Error:",
                error.response?.data || error.message
            );

            setError(
                error.response?.data?.message ||
                "Unable to fetch bookings."
            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // FETCH ALL MECHANICS
    // =====================================================

    const fetchMechanics = async () => {

        try {

            setMechanicsLoading(true);
            setMechanicsError("");

            const token = localStorage.getItem("token");

            if (!token) {

                setMechanicsError(
                    "Admin login token not found."
                );

                return;

            }

            const response = await axios.get(
                `${API_BASE_URL}/api/admin/mechanics`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log(
                "Mechanics Response:",
                response.data
            );

            setMechanics(
                response.data?.mechanics || []
            );

        } catch (error) {

            console.error(
                "Mechanics Fetch Error:",
                error.response?.data || error.message
            );

            setMechanicsError(
                error.response?.data?.message ||
                "Unable to fetch mechanics."
            );

        } finally {

            setMechanicsLoading(false);

        }

    };


    // =====================================================
    // OPEN EDIT MODAL
    // =====================================================

    const openEditModal = (booking) => {

        setSelectedBooking(booking);

        // Existing mechanic
        if (booking.mechanicId?._id) {

            setSelectedMechanic(
                booking.mechanicId._id
            );

        } else {

            setSelectedMechanic("");

        }

        // Existing status
        setSelectedStatus(
            booking.status || "pending"
        );

        setEditModal(true);

    };


    // =====================================================
    // CLOSE EDIT MODAL
    // =====================================================

    const closeEditModal = () => {

        if (
            assignLoading ||
            statusLoading
        ) {
            return;
        }

        setEditModal(false);

        setSelectedBooking(null);

        setSelectedMechanic("");

        setSelectedStatus("");

    };


    // =====================================================
    // ASSIGN / CHANGE MECHANIC
    // =====================================================

    const assignMechanic = async () => {

        try {

            if (!selectedBooking?._id) {

                alert("Booking ID not found.");
                return;

            }

            if (!selectedMechanic) {

                alert("Please select a mechanic.");
                return;

            }

            const token =
                localStorage.getItem("token");

            if (!token) {

                alert(
                    "Admin login token not found."
                );

                return;

            }

            setAssignLoading(true);

            const response = await axios.put(

                `${API_BASE_URL}/api/booking/admin/assign-mechanic/${selectedBooking._id}`,

                {
                    mechanicId: selectedMechanic
                },

                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }

            );

            console.log(
                "Mechanic Assigned:",
                response.data
            );

            // Refresh bookings
            await fetchBookings();

            alert(
                "Mechanic assigned successfully."
            );

        } catch (error) {

            console.error(
                "Assign Mechanic Error:",
                error.response?.data ||
                error.message
            );

            alert(
                error.response?.data?.message ||
                "Unable to assign mechanic."
            );

        } finally {

            setAssignLoading(false);

        }

    };


    // =====================================================
    // UPDATE BOOKING STATUS - ADMIN
    // =====================================================

    const updateBookingStatus = async (bookingId, newStatus) => {

        try {

            if (!bookingId) {

                alert("Booking ID not found.");
                return;

            }

            if (!newStatus) {

                alert("Please select a status.");
                return;

            }

            const token =
                localStorage.getItem("token");

            if (!token) {

                alert(
                    "Admin login token not found."
                );

                return;

            }

            setStatusLoading(true);

            const response = await axios.put(

                `${API_BASE_URL}/api/booking/admin/status/${bookingId}`,

                {
                    status: newStatus
                },

                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }

            );

            console.log(
                "Booking Status Updated:",
                response.data
            );


            // =================================================
            // UPDATE FRONTEND IMMEDIATELY
            // =================================================

            setBookings((previousBookings) =>

                previousBookings.map((booking) =>

                    booking._id === bookingId

                        ? {
                            ...booking,
                            status:
                                response.data?.booking?.status ||
                                newStatus
                        }

                        : booking

                )

            );


            // Update selected booking also
            setSelectedBooking((previous) => {

                if (
                    !previous ||
                    previous._id !== bookingId
                ) {
                    return previous;
                }

                return {
                    ...previous,
                    status:
                        response.data?.booking?.status ||
                        newStatus
                };

            });


            setSelectedStatus(
                response.data?.booking?.status ||
                newStatus
            );


        } catch (error) {

            console.error(
                "Update Booking Status Error:",
                error.response?.data ||
                error.message
            );

            alert(
                error.response?.data?.message ||
                "Unable to update booking status."
            );

        } finally {

            setStatusLoading(false);

        }

    };


    // =====================================================
    // DELETE BOOKING
    // =====================================================

    const deleteBooking = async (bookingId) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this booking?"
            );

        if (!confirmDelete) {
            return;
        }

        try {

            setDeleteLoading(true);

            const token =
                localStorage.getItem("token");

            if (!token) {

                alert(
                    "Admin login token not found."
                );

                return;

            }

            const response = await axios.delete(

                `${API_BASE_URL}/api/booking/admin/delete/${bookingId}`,

                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }

            );

            console.log(
                "Booking Deleted:",
                response.data
            );


            setBookings(
                previousBookings =>
                    previousBookings.filter(
                        booking =>
                            booking._id !== bookingId
                    )
            );


            alert(
                "Booking deleted successfully."
            );

        } catch (error) {

            console.error(
                "Delete Booking Error:",
                error.response?.data ||
                error.message
            );

            alert(
                error.response?.data?.message ||
                "Unable to delete booking."
            );

        } finally {

            setDeleteLoading(false);

        }

    };


    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (date) => {

        if (!date) {
            return "N/A";
        }

        const newDate = new Date(date);

        if (Number.isNaN(newDate.getTime())) {
            return "N/A";
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
    // FORMAT TIME
    // =====================================================

    const formatTime = (time) => {

        if (!time) {
            return "N/A";
        }

        return time;

    };


    // =====================================================
    // STATUS CLASS
    // =====================================================

    const getStatusClass = (status) => {

        if (!status) {
            return "pending";
        }

        return status
            .toString()
            .toLowerCase()
            .replace(/\s+/g, "-");

    };


    // =====================================================
    // GET VEHICLE NAME
    // =====================================================

    const getVehicleName = (vehicle) => {

        if (!vehicle) {
            return "N/A";
        }

        return (
            vehicle.name ||
            vehicle.vehicleName ||
            (
                vehicle.brand &&
                vehicle.model
                    ? `${vehicle.brand} ${vehicle.model}`
                    : null
            ) ||
            vehicle.model ||
            vehicle.registrationNumber ||
            "N/A"
        );

    };


    // =====================================================
    // GET SERVICE NAME
    // =====================================================

    const getServiceName = (service) => {

        if (!service) {
            return "N/A";
        }

        return (
            service.name ||
            service.serviceName ||
            "N/A"
        );

    };


    // =====================================================
    // GET MECHANIC NAME
    // =====================================================

    const getMechanicName = (mechanic) => {

        if (!mechanic) {
            return "Not Assigned";
        }

        return (
            mechanic.name ||
            mechanic.mechanicName ||
            "Not Assigned"
        );

    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <section
            className={`manage-booking ${theme || ""}`}
        >

            <div className="manage-booking-container">


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="manage-booking-header">

                    <div>

                        <span className="manage-booking-tag">
                            BOOKING MANAGEMENT
                        </span>

                        <h2>
                            Manage Bookings
                        </h2>

                        <p>
                            View customer bookings, manage booking
                            status and assign mechanics.
                        </p>

                    </div>


                    {!loading && !error && (

                        <div className="booking-total">

                            <span>
                                Total Bookings
                            </span>

                            <strong>
                                {bookings.length}
                            </strong>

                        </div>

                    )}

                </div>



                {/* =================================================
                    CONTENT
                ================================================= */}

                <div className="manage-booking-content">


                    {/* =================================================
                        LOADING
                    ================================================= */}

                    {loading && (

                        <div className="booking-message">

                            <i className="ri-loader-4-line"></i>

                            <span>
                                Loading bookings...
                            </span>

                        </div>

                    )}



                    {/* =================================================
                        ERROR
                    ================================================= */}

                    {!loading && error && (

                        <div className="booking-message error-message">

                            <i className="ri-error-warning-line"></i>

                            <span>
                                {error}
                            </span>

                        </div>

                    )}



                    {/* =================================================
                        NO BOOKINGS
                    ================================================= */}

                    {!loading &&
                    !error &&
                    bookings.length === 0 && (

                        <div className="booking-message">

                            <i className="ri-calendar-close-line"></i>

                            <span>
                                No bookings found.
                            </span>

                        </div>

                    )}



                    {/* =================================================
                        BOOKING GRID
                    ================================================= */}

                    {!loading &&
                    !error &&
                    bookings.length > 0 && (

                        <div className="booking-grid">

                            {bookings.map((booking) => (

                                <div
                                    className="booking-card"
                                    key={booking._id}
                                >


                                    {/* =================================
                                        CARD HEADER
                                    ================================= */}

                                    <div className="booking-card-header">

                                        <div className="booking-icon">

                                            <i className="ri-calendar-check-line"></i>

                                        </div>


                                        <div className="booking-main-info">

                                            <h3>
                                                Booking
                                            </h3>

                                            <span>
                                                ID: {booking._id}
                                            </span>

                                        </div>


                                        <span
                                            className={`booking-status ${getStatusClass(
                                                booking.status
                                            )}`}
                                        >

                                            {
                                                booking.status ||
                                                "pending"
                                            }

                                        </span>

                                    </div>



                                    {/* =================================
                                        BOOKING DETAILS
                                    ================================= */}

                                    <div className="booking-details">


                                        {/* CUSTOMER */}

                                        <div className="booking-detail-row">

                                            <span>

                                                <i className="ri-user-line"></i>

                                                Customer

                                            </span>

                                            <strong>

                                                {
                                                    booking.userId?.name ||
                                                    "N/A"
                                                }

                                            </strong>

                                        </div>



                                        {/* EMAIL */}

                                        <div className="booking-detail-row">

                                            <span>

                                                <i className="ri-mail-line"></i>

                                                Email

                                            </span>

                                            <strong>

                                                {
                                                    booking.userId?.email ||
                                                    "N/A"
                                                }

                                            </strong>

                                        </div>



                                        {/* PHONE */}

                                        <div className="booking-detail-row">

                                            <span>

                                                <i className="ri-phone-line"></i>

                                                Phone

                                            </span>

                                            <strong>

                                                {
                                                    booking.userId?.phone ||
                                                    "N/A"
                                                }

                                            </strong>

                                        </div>



                                        {/* VEHICLE */}

                                        <div className="booking-detail-row">

                                            <span>

                                                <i className="ri-car-line"></i>

                                                Vehicle

                                            </span>

                                            <strong>

                                                {
                                                    getVehicleName(
                                                        booking.vehicleId
                                                    )
                                                }

                                            </strong>

                                        </div>



                                        {/* SERVICE */}

                                        <div className="booking-detail-row">

                                            <span>

                                                <i className="ri-service-line"></i>

                                                Service

                                            </span>

                                            <strong>

                                                {
                                                    getServiceName(
                                                        booking.serviceId
                                                    )
                                                }

                                            </strong>

                                        </div>



                                        {/* MECHANIC */}

                                        <div className="booking-detail-row">

                                            <span>

                                                <i className="ri-tools-line"></i>

                                                Mechanic

                                            </span>

                                            <strong>

                                                {
                                                    getMechanicName(
                                                        booking.mechanicId
                                                    )
                                                }

                                            </strong>

                                        </div>



                                        {/* DATE */}

                                        <div className="booking-detail-row">

                                            <span>

                                                <i className="ri-calendar-line"></i>

                                                Booking Date

                                            </span>

                                            <strong>

                                                {
                                                    formatDate(
                                                        booking.bookingDate
                                                    )
                                                }

                                            </strong>

                                        </div>



                                        {/* TIME */}

                                        <div className="booking-detail-row">

                                            <span>

                                                <i className="ri-time-line"></i>

                                                Booking Time

                                            </span>

                                            <strong>

                                                {
                                                    formatTime(
                                                        booking.bookingTime
                                                    )
                                                }

                                            </strong>

                                        </div>


                                    </div>



                                    {/* =================================
                                        ADMIN ACTIONS
                                    ================================= */}

                                    <div className="booking-admin-actions">


                                        {/* STATUS SELECT */}

                                        <select
                                            className="booking-status-select"
                                            value={
                                                booking.status ||
                                                "pending"
                                            }
                                            disabled={
                                                statusLoading
                                            }
                                            onChange={(e) =>
                                                updateBookingStatus(
                                                    booking._id,
                                                    e.target.value
                                                )
                                            }
                                        >

                                            {statusOptions.map(
                                                (status) => (

                                                    <option
                                                        key={status}
                                                        value={status}
                                                    >

                                                        {status}

                                                    </option>

                                                )
                                            )}

                                        </select>



                                        {/* ASSIGN MECHANIC */}

                                        <button
                                            type="button"
                                            className="booking-edit-btn"
                                            onClick={() =>
                                                openEditModal(
                                                    booking
                                                )
                                            }
                                        >

                                            <i className="ri-user-settings-line"></i>

                                            Assign Mechanic

                                        </button>



                                        {/* DELETE */}

                                        <button
                                            type="button"
                                            className="booking-delete-btn"
                                            onClick={() =>
                                                deleteBooking(
                                                    booking._id
                                                )
                                            }
                                            disabled={
                                                deleteLoading
                                            }
                                        >

                                            <i className="ri-delete-bin-line"></i>

                                            {
                                                deleteLoading
                                                    ? "Deleting..."
                                                    : "Delete"
                                            }

                                        </button>


                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </div>

            </div>



            {/* =====================================================
                ASSIGN MECHANIC MODAL
            ===================================================== */}

            {editModal && selectedBooking && (

                <div
                    className="booking-modal-overlay"
                    onClick={closeEditModal}
                >

                    <div
                        className="booking-edit-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >


                        {/* =========================================
                            MODAL HEADER
                        ========================================= */}

                        <div className="booking-modal-header">

                            <div>

                                <span>
                                    BOOKING MANAGEMENT
                                </span>

                                <h3>
                                    Manage Booking
                                </h3>

                            </div>


                            <button
                                type="button"
                                className="booking-modal-close"
                                onClick={closeEditModal}
                                disabled={
                                    assignLoading ||
                                    statusLoading
                                }
                            >

                                <i className="ri-close-line"></i>

                            </button>

                        </div>



                        {/* =========================================
                            BOOKING INFO
                        ========================================= */}

                        <div className="booking-modal-info">

                            <div>

                                <span>
                                    Customer
                                </span>

                                <strong>
                                    {
                                        selectedBooking.userId?.name ||
                                        "N/A"
                                    }
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Service
                                </span>

                                <strong>
                                    {
                                        getServiceName(
                                            selectedBooking.serviceId
                                        )
                                    }
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Booking Date
                                </span>

                                <strong>
                                    {
                                        formatDate(
                                            selectedBooking.bookingDate
                                        )
                                    }
                                </strong>

                            </div>

                        </div>



                        {/* =========================================
                            BOOKING STATUS
                        ========================================= */}

                        <div className="booking-form-group">

                            <label>
                                Booking Status
                            </label>

                            <select
                                value={selectedStatus}
                                onChange={(e) => {

                                    const newStatus =
                                        e.target.value;

                                    setSelectedStatus(
                                        newStatus
                                    );

                                    updateBookingStatus(
                                        selectedBooking._id,
                                        newStatus
                                    );

                                }}
                                disabled={
                                    statusLoading
                                }
                            >

                                {statusOptions.map(
                                    (status) => (

                                        <option
                                            key={status}
                                            value={status}
                                        >

                                            {status}

                                        </option>

                                    )
                                )}

                            </select>

                        </div>



                        {/* =========================================
                            SELECT MECHANIC
                        ========================================= */}

                        <div className="booking-form-group">

                            <label>
                                Select Mechanic
                            </label>


                            {mechanicsLoading ? (

                                <div className="mechanic-select-loading">

                                    <i className="ri-loader-4-line"></i>

                                    Loading mechanics...

                                </div>

                            ) : mechanicsError ? (

                                <div className="mechanic-select-error">

                                    {mechanicsError}

                                </div>

                            ) : (

                                <select
                                    value={selectedMechanic}
                                    onChange={(e) =>
                                        setSelectedMechanic(
                                            e.target.value
                                        )
                                    }
                                    disabled={
                                        assignLoading
                                    }
                                >

                                    <option value="">
                                        Select Mechanic
                                    </option>


                                    {mechanics
                                        .filter(
                                            mechanic =>
                                                mechanic.status !==
                                                "Inactive"
                                        )
                                        .map(
                                            mechanic => (

                                                <option
                                                    key={
                                                        mechanic._id
                                                    }
                                                    value={
                                                        mechanic._id
                                                    }
                                                >

                                                    {
                                                        mechanic.name
                                                    }

                                                    {" - "}

                                                    {
                                                        mechanic.specialization
                                                    }

                                                    {" - "}

                                                    {
                                                        mechanic.status
                                                    }

                                                </option>

                                            )
                                        )}

                                </select>

                            )}

                        </div>



                        {/* =========================================
                            CURRENT MECHANIC
                        ========================================= */}

                        {selectedBooking.mechanicId && (

                            <div className="current-mechanic-info">

                                <i className="ri-tools-line"></i>

                                <div>

                                    <span>
                                        Currently Assigned
                                    </span>

                                    <strong>
                                        {
                                            getMechanicName(
                                                selectedBooking.mechanicId
                                            )
                                        }
                                    </strong>

                                </div>

                            </div>

                        )}



                        {/* =========================================
                            MODAL ACTIONS
                        ========================================= */}

                        <div className="booking-modal-actions">

                            <button
                                type="button"
                                className="booking-modal-cancel"
                                onClick={closeEditModal}
                                disabled={
                                    assignLoading ||
                                    statusLoading
                                }
                            >

                                Cancel

                            </button>


                            <button
                                type="button"
                                className="booking-modal-save"
                                onClick={assignMechanic}
                                disabled={
                                    assignLoading ||
                                    !selectedMechanic
                                }
                            >

                                {assignLoading ? (

                                    <>
                                        <i className="ri-loader-4-line"></i>

                                        Assigning...
                                    </>

                                ) : (

                                    <>
                                        <i className="ri-user-settings-line"></i>

                                        Assign Mechanic
                                    </>

                                )}

                            </button>

                        </div>

                    </div>

                </div>

            )}

        </section>

    );

};

export default ManageBooking;