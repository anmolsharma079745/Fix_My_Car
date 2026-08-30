import React, { useEffect, useState } from "react";
import axios from "axios";
import "./BookService.css";
import API_BASE_URL from "../../../services/Api/api";
const BookService = ({ theme, selectedServiceId }) => {


    const [vehicles, setVehicles] = useState([]);
    const [services, setServices] = useState([]);

    const [formData, setFormData] = useState({
        vehicleId: "",
        serviceId: "",
        bookingDate: ""
    });

    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");



    const getToken = () => {
        return localStorage.getItem("token");
    };



    useEffect(() => {
        fetchBookingData();
    }, [selectedServiceId]);


    const fetchBookingData = async () => {

        try {

            setLoading(true);
            setError("");

            const token = getToken();

            if (!token) {
                setError("Customer login token not found.");
                return;
            }



            const vehicleResponse = await axios.get(
                `${API_BASE_URL}/api/vehicle/all`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );



            const serviceResponse = await axios.get(
                `${API_BASE_URL}/api/service/all`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );


            const fetchedVehicles =
                vehicleResponse.data?.vehicles || [];


            const fetchedServices =
                serviceResponse.data?.services || [];



            setVehicles(fetchedVehicles);
            setServices(fetchedServices);



            if (selectedServiceId) {

                const serviceExists =
                    fetchedServices.some(
                        (service) =>
                            service._id === selectedServiceId
                    );


                if (serviceExists) {

                    setFormData((previousData) => ({
                        ...previousData,
                        serviceId: selectedServiceId
                    }));

                }

            }

        } catch (error) {

            console.error(
                "Book Service Fetch Error:",
                error.response?.data || error.message
            );

            setError(
                error.response?.data?.message ||
                "Unable to load vehicles and services."
            );

        } finally {

            setLoading(false);

        }

    };



    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setFormData((previousData) => ({
            ...previousData,
            [name]: value
        }));


        setError("");
        setSuccess("");

    };



    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");



        if (!formData.vehicleId) {

            setError(
                "Please select a vehicle."
            );

            return;

        }


        if (!formData.serviceId) {

            setError(
                "Please select a service."
            );

            return;

        }


        if (!formData.bookingDate) {

            setError(
                "Please select booking date and time."
            );

            return;

        }



        const dateTimeParts =
            formData.bookingDate.split("T");


        const bookingDate =
            dateTimeParts[0];


        const bookingTime =
            dateTimeParts[1];


        if (!bookingDate || !bookingTime) {

            setError(
                "Please select a valid booking date and time."
            );

            return;

        }


        try {

            setBookingLoading(true);


            const token = getToken();


            if (!token) {

                setError(
                    "Customer login token not found."
                );

                return;

            }



            const bookingData = {

                vehicleId:
                    formData.vehicleId,

                serviceId:
                    formData.serviceId,

                bookingDate:
                    bookingDate,

                bookingTime:
                    bookingTime

            };


            console.log(
                "Booking Request Data:",
                bookingData
            );



            const response = await axios.post(
            `${API_BASE_URL}/api/booking/add`,

                bookingData,

                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }

            );


            console.log(
                "Booking Created:",
                response.data
            );



            setSuccess(
                "Booking created successfully! Your booking is pending confirmation."
            );



            setFormData({

                vehicleId: "",

                serviceId:
                    selectedServiceId || "",

                bookingDate: ""

            });


        } catch (error) {

            console.error(

                "Create Booking Error:",

                error.response?.data ||
                error.message

            );


            setError(

                error.response?.data?.message ||

                "Unable to create booking."

            );

        } finally {

            setBookingLoading(false);

        }

    };



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

const minBookingDateTime = getMinBookingDateTime();

    return (

        <section
            id="book-service"
            className={`book-service ${theme || ""}`}
        >

            <div className="book-service-container">



                <div className="book-service-header">

                    <span className="book-service-tag">
                        SERVICE BOOKING
                    </span>

                    <h2>
                        Book a Service
                    </h2>

                    <p>
                        Schedule a service for your vehicle
                        at Fix My Ride.
                    </p>

                </div>



                {loading && (

                    <div className="booking-message">

                        <i className="ri-loader-4-line"></i>

                        <span>
                            Loading booking details...
                        </span>

                    </div>

                )}



                {!loading && error && (

                    <div className="booking-message error-message">

                        <i className="ri-error-warning-line"></i>

                        <span>
                            {error}
                        </span>

                    </div>

                )}



                {success && (

                    <div className="booking-message success-message">

                        <i className="ri-checkbox-circle-line"></i>

                        <span>
                            {success}
                        </span>

                    </div>

                )}



                {!loading &&
                vehicles.length === 0 && (

                    <div className="booking-message error-message">

                        <i className="ri-car-line"></i>

                        <span>
                            Please add a vehicle before booking
                            a service.
                        </span>

                    </div>

                )}



                {!loading &&
                vehicles.length > 0 && (

                    <form
                        className="book-service-form"
                        onSubmit={handleSubmit}
                    >



                        <div className="form-group">

                            <label htmlFor="vehicleId">

                                <i className="ri-car-line"></i>

                                Select Vehicle

                            </label>


                            <select
                                id="vehicleId"
                                name="vehicleId"
                                value={formData.vehicleId}
                                onChange={handleChange}
                                required
                            >

                                <option value="">
                                    Select your vehicle
                                </option>


                                {vehicles.map(
                                    (vehicle) => (

                                        <option
                                            key={vehicle._id}
                                            value={vehicle._id}
                                        >

                                            {vehicle.vehicleName}

                                            {" - "}

                                            {vehicle.model}

                                            {" - "}

                                            {vehicle.numberPlate}

                                        </option>

                                    )
                                )}

                            </select>

                        </div>



                        <div className="form-group">

                            <label htmlFor="serviceId">

                                <i className="ri-tools-line"></i>

                                Select Service

                            </label>


                            <select
                                id="serviceId"
                                name="serviceId"
                                value={formData.serviceId}
                                onChange={handleChange}
                                required
                            >

                                <option value="">
                                    Select a service
                                </option>


                                {services.map(
                                    (service) => (

                                        <option
                                            key={service._id}
                                            value={service._id}
                                        >

                                            {service.serviceName}

                                        </option>

                                    )
                                )}

                            </select>

                        </div>



                        <div className="form-group">

                            <label htmlFor="bookingDate">

                                <i className="ri-calendar-line"></i>

                                Select Date & Time

                            </label>


                            <input
                                type="datetime-local"
                                id="bookingDate"
                                name="bookingDate"
                                value={formData.bookingDate}
                                onChange={handleChange}
                                min={minBookingDateTime}
                                required
                            />

                        </div>



                        {formData.vehicleId && (

                            <div className="booking-preview">

                                <div className="preview-icon">

                                    <i className="ri-car-line"></i>

                                </div>


                                <div>

                                    <span>
                                        SELECTED VEHICLE
                                    </span>


                                    <strong>

                                        {
                                            vehicles.find(
                                                (vehicle) =>
                                                    vehicle._id ===
                                                    formData.vehicleId
                                            )?.vehicleName
                                        }

                                        {" "}

                                        {
                                            vehicles.find(
                                                (vehicle) =>
                                                    vehicle._id ===
                                                    formData.vehicleId
                                            )?.model
                                        }

                                    </strong>

                                </div>

                            </div>

                        )}



                        {formData.serviceId && (

                            <div className="booking-preview">

                                <div className="preview-icon">

                                    <i className="ri-tools-line"></i>

                                </div>


                                <div>

                                    <span>
                                        SELECTED SERVICE
                                    </span>


                                    <strong>

                                        {
                                            services.find(
                                                (service) =>
                                                    service._id ===
                                                    formData.serviceId
                                            )?.serviceName
                                        }

                                    </strong>

                                </div>

                            </div>

                        )}



                        {formData.bookingDate && (

                            <div className="booking-preview">

                                <div className="preview-icon">

                                    <i className="ri-calendar-check-line"></i>

                                </div>


                                <div>

                                    <span>
                                        BOOKING DATE & TIME
                                    </span>


                                    <strong>

                                        {
                                            formData.bookingDate
                                                .replace("T", " ")
                                        }

                                    </strong>

                                </div>

                            </div>

                        )}



                        <button
                            type="submit"
                            className="book-service-btn"
                            disabled={bookingLoading}
                        >

                            {bookingLoading ? (

                                <>

                                    <i className="ri-loader-4-line"></i>

                                    Booking Service...

                                </>

                            ) : (

                                <>

                                    <i className="ri-calendar-check-line"></i>

                                    Book Service

                                </>

                            )}

                        </button>


                    </form>

                )}

            </div>

        </section>

    );

};


export default BookService;
