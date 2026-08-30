import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./AssignMechanic.css";
import "remixicon/fonts/remixicon.css";
import API_BASE_URL from "../../../services/Api/api";

const ADMIN_API = `${API_BASE_URL}/api/admin`;
const BOOKING_API = `${API_BASE_URL}/api/booking`;

const AssignedMechanic = ({ theme }) => {


    const [assignedServices, setAssignedServices] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");



    const getToken = () => {
        return localStorage.getItem("token");
    };



    useEffect(() => {

        fetchAssignedMechanics();

    }, []);


    const fetchAssignedMechanics = async () => {

        try {

            setLoading(true);
            setError("");

            const token = getToken();

            if (!token) {

                setError("Admin login token not found.");
                setLoading(false);

                return;

            }



            const [
                assignedResponse,
                bookingsResponse
            ] = await Promise.all([

                axios.get(
                    `${ADMIN_API}/assigned-mechanics`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                ),

                axios.get(
                    `${BOOKING_API}/admin/all`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )

            ]);


            console.log(
                "Assigned Mechanics Response:",
                assignedResponse.data
            );

            console.log(
                "Fresh Bookings Response:",
                bookingsResponse.data
            );



            const services =
                assignedResponse.data?.services || [];



            const bookings =
                bookingsResponse.data?.bookings || [];


            console.log(
                "Fresh Bookings:",
                bookings
            );



            const bookingMap = new Map();


            bookings.forEach((booking) => {

                if (booking?._id) {

                    bookingMap.set(
                        booking._id.toString(),
                        booking
                    );

                }

            });



            const assignedOnly = services.map((service) => {

    const bookingId =
        service?._id?.toString();

    const freshBooking =
        bookingMap.get(bookingId);

    if (!freshBooking) {
        return service;
    }

    return {
        ...service,

        status:
            freshBooking.status ||
            service.status,

        bookingDate:
            freshBooking.bookingDate ||
            service.bookingDate,

        bookingTime:
            freshBooking.bookingTime ||
            service.bookingTime,

        mechanicId:
            (
                freshBooking.mechanicId &&
                typeof freshBooking.mechanicId === "object"
            )
                ? freshBooking.mechanicId
                : service.mechanicId,

        userId:
            freshBooking.userId ||
            service.userId,

        vehicleId:
            freshBooking.vehicleId ||
            service.vehicleId,

        serviceId:
            freshBooking.serviceId ||
            service.serviceId
    };

});


            console.log(
                "FINAL ASSIGNED SERVICES:",
                assignedOnly
            );


            setAssignedServices(
                assignedOnly
            );

        }

        catch (err) {

            console.error(
                "Assigned Mechanics Error:",
                err.response?.data ||
                err.message
            );

            setError(
                err.response?.data?.message ||
                "Unable to fetch assigned mechanics."
            );

        }

        finally {

            setLoading(false);

        }

    };



    const formatDate = (date) => {

        if (!date) {
            return "N/A";
        }

        const parsedDate =
            new Date(date);


        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {

            return "N/A";

        }


        return parsedDate.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    };



    const normalizeStatus = (status) => {

        return (
            status ||
            "Inactive"
        )
            .toString()
            .trim()
            .toLowerCase();

    };



    const getStatusClass = (status) => {

        return normalizeStatus(status)
            .replace(/\s+/g, "-");

    };



    const getMechanic = (service) => {

        if (
            service?.mechanicId &&
            typeof service.mechanicId === "object"
        ) {

            return service.mechanicId;

        }


        if (
            service?.mechanic &&
            typeof service.mechanic === "object"
        ) {

            return service.mechanic;

        }


        return null;

    };



    const getMechanicName = (service) => {

        const mechanic =
            getMechanic(service);


        if (!mechanic) {
            return "Not Assigned";
        }


        return (
            mechanic.name ||
            mechanic.fullName ||
            "Mechanic"
        );

    };



    const getMechanicEmail = (service) => {

        const mechanic =
            getMechanic(service);


        return (
            mechanic?.email ||
            "No email available"
        );

    };



    const getMechanicPhone = (service) => {

        const mechanic =
            getMechanic(service);


        return (
            mechanic?.phone ||
            mechanic?.mobile ||
            "N/A"
        );

    };



    const getSpecialization = (service) => {

        const mechanic =
            getMechanic(service);


        return (
            mechanic?.specialization ||
            mechanic?.expertise ||
            "N/A"
        );

    };



    const getExperience = (service) => {

        const mechanic =
            getMechanic(service);


        if (
            mechanic?.experience !== undefined &&
            mechanic?.experience !== null &&
            mechanic?.experience !== ""
        ) {

            return mechanic.experience;

        }


        return "N/A";

    };



    const getMechanicStatus = (service) => {

        const mechanic =
            getMechanic(service);


        if (!mechanic) {
            return "Inactive";
        }


        return (
            mechanic.status ||
            "Inactive"
        );

    };



    const getServiceName = (service) => {

        return (
            service.serviceName ||
            service.name ||
            service.serviceId?.name ||
            "Service"
        );

    };



    const getCustomerName = (service) => {

        return (
            service.userId?.name ||
            service.customerId?.name ||
            service.customer?.name ||
            service.user?.name ||
            "N/A"
        );

    };



    const getVehicleName = (service) => {

        return (
            service.vehicleId?.name ||
            service.vehicleId?.vehicleName ||
            service.vehicleId?.model ||

            (
                service.vehicleId?.brand &&
                service.vehicleId?.model
                    ? `${service.vehicleId.brand} ${service.vehicleId.model}`
                    : null
            ) ||

            service.vehicle?.name ||
            service.vehicle?.vehicleName ||
            service.vehicle?.model ||

            "N/A"
        );

    };



    const getBookingDate = (service) => {

        return (
            service.bookingDate ||
            service.date ||
            service.serviceDate ||
            service.createdAt ||
            null
        );

    };



    const getBookingStatus = (service) => {

        return (
            service.status ||
            "pending"
        );

    };



    const filteredServices = useMemo(() => {

        const searchValue =
            search
                .toLowerCase()
                .trim();


        return assignedServices.filter(
            (service) => {

                const mechanicName =
                    getMechanicName(service)
                        .toLowerCase();


                const mechanicEmail =
                    getMechanicEmail(service)
                        .toLowerCase();


                const customerName =
                    getCustomerName(service)
                        .toLowerCase();


                const vehicleName =
                    getVehicleName(service)
                        .toLowerCase();


                const serviceName =
                    getServiceName(service)
                        .toLowerCase();


                const matchesSearch =
                    !searchValue ||
                    mechanicName.includes(searchValue) ||
                    mechanicEmail.includes(searchValue) ||
                    customerName.includes(searchValue) ||
                    vehicleName.includes(searchValue) ||
                    serviceName.includes(searchValue);



                const mechanicStatus =
                    normalizeStatus(
                        getMechanicStatus(service)
                    );


                const matchesStatus =
                    statusFilter === "all" ||
                    mechanicStatus === statusFilter;


                return (
                    matchesSearch &&
                    matchesStatus
                );

            }
        );

    }, [
        assignedServices,
        search,
        statusFilter
    ]);



    const totalAssigned =
        assignedServices.length;


    const availableCount =
        assignedServices.filter(
            (service) =>
                normalizeStatus(
                    getMechanicStatus(service)
                ) === "available"
        ).length;


    const busyCount =
        assignedServices.filter(
            (service) =>
                normalizeStatus(
                    getMechanicStatus(service)
                ) === "busy"
        ).length;


    const inactiveCount =
        assignedServices.filter(
            (service) =>
                normalizeStatus(
                    getMechanicStatus(service)
                ) === "inactive"
        ).length;



    const getMechanicStatusIcon = (status) => {

        const normalized =
            normalizeStatus(status);


        if (normalized === "available") {
            return "ri-checkbox-circle-line";
        }


        if (normalized === "busy") {
            return "ri-tools-line";
        }


        return "ri-close-circle-line";

    };



    return (

        <section
            className={`assigned-mechanic ${theme || ""}`}
        >

            <div className="assigned-mechanic-container">



                <div className="assigned-mechanic-header">

                    <div>

                        <span className="assigned-mechanic-tag">
                            SERVICE MANAGEMENT
                        </span>

                        <h2>
                            Assigned Mechanics
                        </h2>

                        <p>
                            View and monitor mechanics assigned
                            to customer services.
                        </p>

                    </div>


                    {!loading && (

                        <button
                            type="button"
                            className="assigned-refresh-btn"
                            onClick={fetchAssignedMechanics}
                        >

                            <i className="ri-refresh-line"></i>

                            Refresh

                        </button>

                    )}

                </div>



                {!loading && !error && (

                    <div className="assigned-stats">



                        <div className="assigned-stat-card">

                            <div className="assigned-stat-icon blue">

                                <i className="ri-team-line"></i>

                            </div>

                            <div>

                                <span>
                                    Total Assigned
                                </span>

                                <strong>
                                    {totalAssigned}
                                </strong>

                            </div>

                        </div>



                        <div className="assigned-stat-card">

                            <div className="assigned-stat-icon green">

                                <i className="ri-checkbox-circle-line"></i>

                            </div>

                            <div>

                                <span>
                                    Available
                                </span>

                                <strong>
                                    {availableCount}
                                </strong>

                            </div>

                        </div>



                        <div className="assigned-stat-card">

                            <div className="assigned-stat-icon orange">

                                <i className="ri-tools-line"></i>

                            </div>

                            <div>

                                <span>
                                    Busy
                                </span>

                                <strong>
                                    {busyCount}
                                </strong>

                            </div>

                        </div>



                        <div className="assigned-stat-card">

                            <div className="assigned-stat-icon red">

                                <i className="ri-close-circle-line"></i>

                            </div>

                            <div>

                                <span>
                                    Inactive
                                </span>

                                <strong>
                                    {inactiveCount}
                                </strong>

                            </div>

                        </div>

                    </div>

                )}



                {!loading &&
                !error &&
                assignedServices.length > 0 && (

                    <div className="assigned-controls">



                        <div className="assigned-search">

                            <i className="ri-search-line"></i>

                            <input
                                type="text"
                                placeholder="Search mechanic, customer, vehicle or service..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                            />


                            {search && (

                                <button
                                    type="button"
                                    className="assigned-search-clear"
                                    onClick={() =>
                                        setSearch("")
                                    }
                                >

                                    <i className="ri-close-line"></i>

                                </button>

                            )}

                        </div>



                        <div className="assigned-filter">

                            <i className="ri-filter-3-line"></i>

                            <select
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="all">
                                    All Status
                                </option>

                                <option value="available">
                                    Available
                                </option>

                                <option value="busy">
                                    Busy
                                </option>

                                <option value="inactive">
                                    Inactive
                                </option>

                            </select>

                        </div>

                    </div>

                )}



                <div className="assigned-mechanic-content">



                    {loading && (

                        <div className="assigned-message">

                            <i className="ri-loader-4-line"></i>

                            <span>
                                Loading assigned mechanics...
                            </span>

                        </div>

                    )}



                    {!loading && error && (

                        <div className="assigned-message error-message">

                            <i className="ri-error-warning-line"></i>

                            <span>
                                {error}
                            </span>

                            <button
                                type="button"
                                onClick={fetchAssignedMechanics}
                            >
                                Try Again
                            </button>

                        </div>

                    )}



                    {!loading &&
                    !error &&
                    assignedServices.length === 0 && (

                        <div className="assigned-message">

                            <i className="ri-user-search-line"></i>

                            <span>
                                No mechanics assigned yet.
                            </span>

                        </div>

                    )}



                    {!loading &&
                    !error &&
                    assignedServices.length > 0 &&
                    filteredServices.length === 0 && (

                        <div className="assigned-message">

                            <i className="ri-search-line"></i>

                            <span>
                                No assigned services match
                                your search or filter.
                            </span>

                            <button
                                type="button"
                                onClick={() => {

                                    setSearch("");
                                    setStatusFilter("all");

                                }}
                            >
                                Clear Filters
                            </button>

                        </div>

                    )}



                    {!loading &&
                    !error &&
                    filteredServices.length > 0 && (

                        <div className="assigned-mechanic-grid">

                            {filteredServices.map(
                                (service) => {

                                    const mechanicStatus =
                                        getMechanicStatus(service);


                                    const bookingStatus =
                                        getBookingStatus(service);


                                    return (

                                        <div
                                            className="assigned-mechanic-card"
                                            key={service._id}
                                        >



                                            <div className="mechanic-card-top">

                                                <div className="mechanic-icon">

                                                    <i className="ri-tools-line"></i>

                                                </div>


                                                <div className="mechanic-main-info">

                                                    <h3>
                                                        {
                                                            getMechanicName(
                                                                service
                                                            )
                                                        }
                                                    </h3>


                                                    <span className="mechanic-email">

                                                        {
                                                            getMechanicEmail(
                                                                service
                                                            )
                                                        }

                                                    </span>



                                                    <span
                                                        className={`mechanic-status ${getStatusClass(
                                                            mechanicStatus
                                                        )}`}
                                                    >

                                                        <i
                                                            className={getMechanicStatusIcon(
                                                                mechanicStatus
                                                            )}
                                                        ></i>

                                                        {
                                                            mechanicStatus
                                                        }

                                                    </span>

                                                </div>

                                            </div>



                                            <div className="mechanic-details">


                                                <div className="detail-row">

                                                    <span>
                                                        <i className="ri-phone-line"></i>
                                                        Phone
                                                    </span>

                                                    <strong>
                                                        {
                                                            getMechanicPhone(
                                                                service
                                                            )
                                                        }
                                                    </strong>

                                                </div>


                                                <div className="detail-row">

                                                    <span>
                                                        <i className="ri-tools-line"></i>
                                                        Specialization
                                                    </span>

                                                    <strong>
                                                        {
                                                            getSpecialization(
                                                                service
                                                            )
                                                        }
                                                    </strong>

                                                </div>


                                                <div className="detail-row">

                                                    <span>
                                                        <i className="ri-award-line"></i>
                                                        Experience
                                                    </span>

                                                    <strong>
                                                        {
                                                            getExperience(
                                                                service
                                                            )
                                                        }
                                                    </strong>

                                                </div>


                                                <div className="detail-row">

                                                    <span>
                                                        <i className="ri-service-line"></i>
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


                                                <div className="detail-row">

                                                    <span>
                                                        <i className="ri-money-rupee-circle-line"></i>
                                                        Price
                                                    </span>

                                                    <strong>

                                                        {
                                                            service.price !== undefined &&
                                                            service.price !== null
                                                                ? `₹${Number(
                                                                    service.price
                                                                ).toLocaleString(
                                                                    "en-IN"
                                                                )}`
                                                                : "N/A"
                                                        }

                                                    </strong>

                                                </div>


                                                <div className="detail-row">

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


                                                <div className="detail-row">

                                                    <span>
                                                        <i className="ri-car-line"></i>
                                                        Vehicle
                                                    </span>

                                                    <strong>
                                                        {
                                                            getVehicleName(
                                                                service
                                                            )
                                                        }
                                                    </strong>

                                                </div>


                                                <div className="detail-row">

                                                    <span>
                                                        <i className="ri-calendar-line"></i>
                                                        Date
                                                    </span>

                                                    <strong>
                                                        {
                                                            formatDate(
                                                                getBookingDate(
                                                                    service
                                                                )
                                                            )
                                                        }
                                                    </strong>

                                                </div>



                                                <div className="detail-row">

                                                    <span>
                                                        <i className="ri-checkbox-circle-line"></i>
                                                        Booking Status
                                                    </span>


                                                    <strong
                                                        className={`booking-status ${getStatusClass(
                                                            bookingStatus
                                                        )}`}
                                                    >

                                                        {
                                                            bookingStatus
                                                        }

                                                    </strong>

                                                </div>

                                            </div>



                                            <div className="assigned-service-description">

                                                <div className="description-heading">

                                                    <div className="description-icon">

                                                        <i className="ri-file-text-line"></i>

                                                    </div>


                                                    <div className="description-title">

                                                        <span>
                                                            Service Description
                                                        </span>

                                                        <small>
                                                            Customer Request
                                                        </small>

                                                    </div>

                                                </div>


                                                <div className="description-content">

                                                    <p>

                                                        {
                                                            service.description ||
                                                            "No specific service instructions or customer notes were provided for this booking."
                                                        }

                                                    </p>

                                                </div>

                                            </div>



                                            <div className="assigned-card-footer">

                                                <span>

                                                    <i className="ri-link"></i>

                                                    Mechanic Assigned

                                                </span>


                                                <span className="booking-id">

                                                    #

                                                    {
                                                        service._id?.slice(-6)
                                                    }

                                                </span>

                                            </div>

                                        </div>

                                    );

                                }
                            )}

                        </div>

                    )}

                </div>

            </div>

        </section>

    );

};


export default AssignedMechanic;