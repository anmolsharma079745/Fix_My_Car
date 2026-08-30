import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AssignedServices.css";
import "remixicon/fonts/remixicon.css";
import API_BASE_URL from "../../../services/Api/api";
const BOOKING_API = `${API_BASE_URL}/api/booking`;

const AssignedServices = ({ theme }) => {


    const [services, setServices] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [selectedService, setSelectedService] = useState(null);

    const [updatingId, setUpdatingId] = useState(null);



    const getToken = () => {
        return localStorage.getItem("token");
    };



    useEffect(() => {

        fetchAssignedServices();

    }, []);


    const fetchAssignedServices = async () => {

        try {

            setLoading(true);
            setError("");

            const token = getToken();

            if (!token) {

                setError("Mechanic login token not found.");

                setLoading(false);

                return;
            }


            const response = await axios.get(

                `${BOOKING_API}/mechanic/assigned`,

                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }

            );


            console.log(
                "Assigned Services Response:",
                response.data
            );


            const bookingData =
                response.data.bookings ||
                response.data.services ||
                response.data.data ||
                [];


            setServices(bookingData);

        } catch (err) {

            console.error(
                "Fetch Assigned Services Error:",
                err.response?.data || err.message
            );


            setError(
                err.response?.data?.message ||
                "Unable to fetch assigned services."
            );

        } finally {

            setLoading(false);

        }

    };



    const updateStatus = async (id, status) => {

        try {

            setUpdatingId(id);

            setError("");

            const token = getToken();


            if (!token) {

                setError("Mechanic login token not found.");

                return;
            }


            console.log(
                "Updating Booking:",
                id
            );

            console.log(
                "New Status:",
                status
            );



            const response = await axios.put(

                `${BOOKING_API}/mechanic/update/${id}`,

                {
                    status: status
                },

                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }

            );


            console.log(
                "Status Update Response:",
                response.data
            );


            const updatedBooking =
                response.data.booking ||
                response.data.data ||
                response.data.service ||
                null;


            const newStatus =
                updatedBooking?.status ||
                status;



            setServices((prevServices) => {

                return prevServices.map((service) => {

                    if (service._id !== id) {

                        return service;

                    }


                    return {

                        ...service,

                        ...(updatedBooking || {}),

                        status: newStatus

                    };

                });

            });



            setSelectedService((prevService) => {

                if (
                    !prevService ||
                    prevService._id !== id
                ) {

                    return prevService;

                }


                return {

                    ...prevService,

                    ...(updatedBooking || {}),

                    status: newStatus

                };

            });



            await fetchAssignedServices();


        } catch (err) {

            console.error(
                "Update Status Error:",
                err.response?.data || err.message
            );


            setError(
                err.response?.data?.message ||
                "Unable to update service status."
            );

        } finally {

            setUpdatingId(null);

        }

    };



    const formatDate = (date) => {

        if (!date) {

            return "N/A";

        }


        const newDate = new Date(date);


        if (Number.isNaN(newDate.getTime())) {

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



    const getVehicleName = (service) => {

        if (service.vehicleId) {

            if (
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



    const getServiceName = (service) => {

        if (service.serviceId) {

            if (
                typeof service.serviceId === "object"
            ) {

                return (

                    service.serviceId.serviceName ||
                    service.serviceId.name ||
                    "Vehicle Service"

                );

            }

        }


        if (service.service?.serviceName) {

            return service.service.serviceName;

        }


        if (service.serviceName) {

            return service.serviceName;

        }


        return "Vehicle Service";

    };



    const getStatus = (service) => {

        return (
            service.status ||
            "pending"
        );

    };



    const getStatusClass = (status) => {

        return (

            status
                ?.toString()
                .toLowerCase()
                .replace(/\s+/g, "-")

        ) || "pending";

    };



    const getStatusLabel = (status) => {

        if (!status) {

            return "Pending";

        }


        switch (status) {

            case "pending":
                return "Pending";

            case "confirmed":
                return "Confirmed";

            case "In Progress":
                return "In Progress";

            case "Completed":
                return "Completed";

            case "cancelled":
                return "Cancelled";

            default:
                return status;

        }

    };



    return (

        <section
            className={`assigned-services ${theme || ""}`}
        >

            <div className="assigned-services-container">



                <div className="assigned-services-heading">

                    <span className="dashboard-tag">
                        ASSIGNED WORK
                    </span>

                    <h2>
                        Assigned Services
                    </h2>

                    <p>
                        View and manage the services assigned to you.
                    </p>

                </div>



                {error && (

                    <div className="assigned-services-alert">

                        <i className="ri-error-warning-line"></i>

                        <span>
                            {error}
                        </span>

                    </div>

                )}



                {loading && (

                    <div className="assigned-services-message">

                        <i className="ri-loader-4-line"></i>

                        <span>
                            Loading assigned services...
                        </span>

                    </div>

                )}



                {!loading &&
                !error &&
                services.length === 0 && (

                    <div className="assigned-services-empty">

                        <div className="empty-service-icon">

                            <i className="ri-tools-line"></i>

                        </div>

                        <h3>
                            No Assigned Services
                        </h3>

                        <p>
                            You currently have no services assigned to you.
                        </p>

                    </div>

                )}



                {!loading &&
                services.length > 0 && (

                    <div className="assigned-services-list">

                        {services.map((service) => {

                            const status =
                                getStatus(service);


                            return (

                                <div
                                    className="assigned-service-card"
                                    key={service._id}
                                >



                                    <div className="service-card-header">

                                        <div className="vehicle-title">

                                            <div className="vehicle-icon">

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
                                                        service._id
                                                            ?.slice(-6)
                                                            .toUpperCase()
                                                    }

                                                </span>

                                            </div>

                                        </div>



                                        <span
                                            className={`service-status ${getStatusClass(
                                                status
                                            )}`}
                                        >
                                            <span className="service-status-dot"></span>

                                            {
                                                getStatusLabel(
                                                    status
                                                )
                                            }

                                        </span>

                                    </div>



                                    <div className="service-card-details">



                                        <div className="service-detail">

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



                                        <div className="service-detail">

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



                                        <div className="service-detail">

                                            <span>

                                                <i className="ri-calendar-line"></i>

                                                Date

                                            </span>


                                            <strong>

                                                {
                                                    formatDate(
                                                        service.bookingDate ||
                                                        service.date ||
                                                        service.serviceDate
                                                    )
                                                }

                                            </strong>

                                        </div>



                                        <div className="service-detail">

                                            <span>

                                                <i className="ri-time-line"></i>

                                                Time

                                            </span>


                                            <strong>

                                                {
                                                    service.bookingTime ||
                                                    service.time ||
                                                    service.timeSlot ||
                                                    "N/A"
                                                }

                                            </strong>

                                        </div>

                                    </div>



                                    <div className="service-card-action">



                                        <button
                                            type="button"
                                            className="view-service-btn"
                                            onClick={() =>
                                                setSelectedService(
                                                    service
                                                )
                                            }
                                        >

                                            <i className="ri-eye-line"></i>

                                            View Service

                                        </button>



                                        {status !== "Completed" &&
                                        status !== "cancelled" && (

                                            <select
                                                className="status-select"
                                                value={status}
                                                disabled={
                                                    updatingId ===
                                                    service._id
                                                }
                                                onChange={(e) => {

                                                    updateStatus(
                                                        service._id,
                                                        e.target.value
                                                    );

                                                }}
                                            >

                                                <option value="pending">
                                                    Pending
                                                </option>

                                                <option value="confirmed">
                                                    Confirmed
                                                </option>

                                                <option value="In Progress">
                                                    In Progress
                                                </option>

                                                <option value="Completed">
                                                    Completed
                                                </option>

                                            </select>

                                        )}



                                        {status === "Completed" && (

                                            <div className="completed-status-label">

                                                <i className="ri-checkbox-circle-line"></i>

                                                Completed

                                            </div>

                                        )}



                                        {status === "cancelled" && (

                                            <div className="completed-status-label">

                                                <i className="ri-close-circle-line"></i>

                                                Cancelled

                                            </div>

                                        )}

                                    </div>

                                </div>

                            );

                        })}

                    </div>

                )}

            </div>



            {selectedService && (

                <div
                    className="service-details-overlay"
                    onMouseDown={(e) => {

                        if (
                            e.target === e.currentTarget
                        ) {

                            setSelectedService(null);

                        }

                    }}
                >

                    <div className="service-details-modal">



                        <div className="service-details-modal-header">

                            <div>

                                <span>
                                    SERVICE DETAILS
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



                        <div className="modal-service-details">



                            <div className="modal-detail">

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



                            <div className="modal-detail">

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



                            <div className="modal-detail">

                                <span>
                                    Date
                                </span>

                                <strong>

                                    {
                                        formatDate(
                                            selectedService.bookingDate ||
                                            selectedService.date ||
                                            selectedService.serviceDate
                                        )
                                    }

                                </strong>

                            </div>



                            <div className="modal-detail">

                                <span>
                                    Time
                                </span>

                                <strong>

                                    {
                                        selectedService.bookingTime ||
                                        selectedService.time ||
                                        selectedService.timeSlot ||
                                        "N/A"
                                    }

                                </strong>

                            </div>



                            <div className="modal-detail full-width">

                                <span>
                                    Current Status
                                </span>

                                <strong
                                    className={`modal-status ${getStatusClass(
                                        getStatus(
                                            selectedService
                                        )
                                    )}`}
                                >

                                    {
                                        getStatusLabel(
                                            getStatus(
                                                selectedService
                                            )
                                        )
                                    }

                                </strong>

                            </div>



                            {selectedService.notes && (

                                <div className="modal-detail full-width">

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



                            {selectedService.mechanicNotes && (

                                <div className="modal-detail full-width">

                                    <span>
                                        Mechanic Update
                                    </span>

                                    <p>
                                        {
                                            selectedService.mechanicNotes
                                        }
                                    </p>

                                </div>

                            )}

                        </div>



                        {getStatus(selectedService) !== "Completed" &&
                        getStatus(selectedService) !== "cancelled" && (

                            <div className="modal-status-actions">



                                {getStatus(selectedService) !== "In Progress" && (

                                    <button
                                        type="button"
                                        onClick={() =>
                                            updateStatus(
                                                selectedService._id,
                                                "In Progress"
                                            )
                                        }
                                        disabled={
                                            updatingId ===
                                            selectedService._id
                                        }
                                    >

                                        <i className="ri-play-line"></i>

                                        {updatingId === selectedService._id
                                            ? "Updating..."
                                            : "Start Service"}

                                    </button>

                                )}



                                <button
                                    type="button"
                                    onClick={() =>
                                        updateStatus(
                                            selectedService._id,
                                            "Completed"
                                        )
                                    }
                                    disabled={
                                        updatingId ===
                                        selectedService._id
                                    }
                                >

                                    <i className="ri-checkbox-circle-line"></i>

                                    {updatingId === selectedService._id
                                        ? "Updating..."
                                        : "Complete"}

                                </button>

                            </div>

                        )}



                        {getStatus(selectedService) === "Completed" && (

                            <div className="modal-completed-message">

                                <i className="ri-checkbox-circle-fill"></i>

                                <span>
                                    This service has been completed.
                                </span>

                            </div>

                        )}



                        {getStatus(selectedService) === "cancelled" && (

                            <div className="modal-completed-message">

                                <i className="ri-close-circle-fill"></i>

                                <span>
                                    This service has been cancelled.
                                </span>

                            </div>

                        )}

                    </div>

                </div>

            )}

        </section>

    );

};

export default AssignedServices;