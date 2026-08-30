import React, { useEffect, useState } from "react";
import axios from "axios";

import ServiceCard from "../servicesCard/servicesCard.jsx";
import API_BASE_URL from "../../../services/Api/api.js";
import "./allServices.css";


const SERVICE_API = `${API_BASE_URL}/api/service`;


const AllServices = ({ theme }) => {


    const [services, setServices] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [userRole, setUserRole] = useState("");

    const [showAddModal, setShowAddModal] = useState(false);

    const [showUpdateModal, setShowUpdateModal] = useState(false);

    const [selectedService, setSelectedService] = useState(null);

    const [saving, setSaving] = useState(false);

    const [deletingId, setDeletingId] = useState(null);



    const emptyForm = {

        serviceName: "",

        description: "",

        price: "",

        duration: "",

        vehicleType: "Car"

    };


    const [formData, setFormData] =
        useState(emptyForm);



    useEffect(() => {

        const storedUser =
            localStorage.getItem("user");


        if (!storedUser) {

            setUserRole("");

            return;

        }


        try {

            const user =
                JSON.parse(storedUser);


            setUserRole(
                user?.role || ""
            );

        } catch (err) {

            console.error(
                "User Data Error:",
                err
            );

            setUserRole("");

        }

    }, []);



    useEffect(() => {

        fetchServices();

    }, []);


    const fetchServices = async () => {

        try {

            setLoading(true);

            setError("");


            const response =
                await axios.get(
                    `${SERVICE_API}/all`
                );


            setServices(
                response.data.services || []
            );

        } catch (err) {

            console.error(
                "Fetch Services Error:",
                err
            );


            setError(
                err.response?.data?.message ||
                "Unable to load services."
            );

        } finally {

            setLoading(false);

        }

    };



    const getToken = () => {

        return localStorage.getItem(
            "token"
        );

    };



    const handleFormChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setFormData((prev) => ({

            ...prev,

            [name]: value

        }));

    };



    const openAddModal = () => {

        setFormData(emptyForm);

        setError("");

        setShowAddModal(true);

    };



    const closeAddModal = () => {

        if (saving) return;

        setShowAddModal(false);

        setFormData(emptyForm);

    };



    const openUpdateModal = (service) => {

        setSelectedService(service);


        setFormData({

            serviceName:
                service?.serviceName || "",

            description:
                service?.description || "",

            price:
                service?.price ?? "",

            duration:
                service?.duration || "",

            vehicleType:
                service?.vehicleType || "Car"

        });


        setError("");

        setShowUpdateModal(true);

    };



    const closeUpdateModal = () => {

        if (saving) return;

        setShowUpdateModal(false);

        setSelectedService(null);

        setFormData(emptyForm);

    };



    const validateForm = () => {

        if (
            !formData.serviceName.trim()
        ) {

            setError(
                "Service name is required."
            );

            return false;

        }


        if (
            !formData.description.trim()
        ) {

            setError(
                "Service description is required."
            );

            return false;

        }


        if (
            formData.price === "" ||
            Number(formData.price) < 0
        ) {

            setError(
                "Please enter a valid price."
            );

            return false;

        }


        if (
            !formData.duration.trim()
        ) {

            setError(
                "Service duration is required."
            );

            return false;

        }


        if (
            !["Car", "Bike"].includes(
                formData.vehicleType
            )
        ) {

            setError(
                "Please select Car or Bike."
            );

            return false;

        }


        return true;

    };



    const handleAddService = async (e) => {

        e.preventDefault();


        if (!validateForm()) {

            return;

        }


        try {

            setSaving(true);

            setError("");


            const token =
                getToken();


            if (!token) {

                setError(
                    "Admin login token not found."
                );

                return;

            }


            const payload = {

                serviceName:
                    formData.serviceName.trim(),

                description:
                    formData.description.trim(),

                price:
                    Number(formData.price),

                duration:
                    formData.duration.trim(),

                vehicleType:
                    formData.vehicleType

            };


            const response =
                await axios.post(

                    `${SERVICE_API}/add`,

                    payload,

                    {

                        headers: {

                            Authorization:
                                `Bearer ${token}`

                        }

                    }

                );


            console.log(
                "Service Added:",
                response.data
            );


            setShowAddModal(false);

            setFormData(emptyForm);


            await fetchServices();

        } catch (err) {

            console.error(
                "Add Service Error:",
                err.response?.data ||
                err.message
            );


            setError(
                err.response?.data?.message ||
                "Unable to add service."
            );

        } finally {

            setSaving(false);

        }

    };



    const handleUpdateService = async (e) => {

        e.preventDefault();


        if (!selectedService?._id) {

            setError(
                "Service not selected."
            );

            return;

        }


        if (!validateForm()) {

            return;

        }


        try {

            setSaving(true);

            setError("");


            const token =
                getToken();


            if (!token) {

                setError(
                    "Admin login token not found."
                );

                return;

            }


            const payload = {

                serviceName:
                    formData.serviceName.trim(),

                description:
                    formData.description.trim(),

                price:
                    Number(formData.price),

                duration:
                    formData.duration.trim(),

                vehicleType:
                    formData.vehicleType

            };


            const response =
                await axios.put(

                    `${SERVICE_API}/update/${selectedService._id}`,

                    payload,

                    {

                        headers: {

                            Authorization:
                                `Bearer ${token}`

                        }

                    }

                );


            console.log(
                "Service Updated:",
                response.data
            );


            setShowUpdateModal(false);

            setSelectedService(null);

            setFormData(emptyForm);


            await fetchServices();

        } catch (err) {

            console.error(
                "Update Service Error:",
                err.response?.data ||
                err.message
            );


            setError(
                err.response?.data?.message ||
                "Unable to update service."
            );

        } finally {

            setSaving(false);

        }

    };



    const handleDeleteService = async (service) => {

        if (!service?._id) {

            return;

        }


        const confirmDelete =
            window.confirm(

                `Are you sure you want to delete "${service.serviceName}"?`

            );


        if (!confirmDelete) {

            return;

        }


        try {

            setDeletingId(
                service._id
            );

            setError("");


            const token =
                getToken();


            if (!token) {

                setError(
                    "Admin login token not found."
                );

                return;

            }


            const response =
                await axios.delete(

                    `${SERVICE_API}/delete/${service._id}`,

                    {

                        headers: {

                            Authorization:
                                `Bearer ${token}`

                        }

                    }

                );


            console.log(
                "Service Deleted:",
                response.data
            );


            setServices((prevServices) =>

                prevServices.filter(

                    (item) =>
                        item._id !== service._id

                )

            );

        } catch (err) {

            console.error(
                "Delete Service Error:",
                err.response?.data ||
                err.message
            );


            setError(
                err.response?.data?.message ||
                "Unable to delete service."
            );

        } finally {

            setDeletingId(null);

        }

    };



    return (

        <section
            className={`all-services ${theme}`}
            id="all-services"
        >



            <div className="all-services-header">

                <span className="all-services-tag">
                    OUR SERVICES
                </span>


                <h2>

                    Choose The Right Service

                    <span>
                        {" "}For Your Vehicle
                    </span>

                </h2>


                <p>

                    Professional vehicle maintenance and repair
                    services provided by trusted mechanics.

                </p>



                {userRole === "admin" && (

                    <button
                        type="button"
                        className="add-service-btn"
                        onClick={openAddModal}
                    >

                        <i className="ri-add-line"></i>

                        <span>
                            Add Service
                        </span>

                    </button>

                )}

            </div>




            {error && (

                <div className="services-error">

                    <div className="services-error-icon">

                        <i className="ri-error-warning-line"></i>

                    </div>


                    <h3>
                        Something went wrong
                    </h3>


                    <p>
                        {error}
                    </p>


                    <button
                        type="button"
                        className="services-retry-btn"
                        onClick={fetchServices}
                    >

                        <i className="ri-refresh-line"></i>

                        Try Again

                    </button>

                </div>

            )}




            {loading && (

                <div className="services-loading">

                    <div className="services-loader">

                        <i className="ri-loader-4-line"></i>

                    </div>


                    <p>
                        Loading services...
                    </p>

                </div>

            )}




            {!loading &&
            !error &&
            services.length === 0 && (

                <div className="no-services">

                    <div className="no-services-icon">

                        <i className="ri-tools-line"></i>

                    </div>


                    <h3>
                        No Services Available
                    </h3>


                    <p>

                        Services will appear here once
                        they are added by the admin.

                    </p>

                </div>

            )}




            {!loading &&
            !error &&
            services.length > 0 && (

                <div className="all-services-grid">

                    {services.map((service) => (

                        <ServiceCard

                            key={service._id}

                            service={service}

                            theme={theme}

                            userRole={userRole}

                            onUpdate={
                                openUpdateModal
                            }

                            onDelete={
                                handleDeleteService
                            }

                            deleting={
                                deletingId === service._id
                            }

                        />

                    ))}

                </div>

            )}




            {showAddModal && (

                <div
                    className={`service-modal-overlay ${theme}`}
                    onMouseDown={(e) => {

                        if (
                            e.target === e.currentTarget
                        ) {

                            closeAddModal();

                        }

                    }}
                >

                    <div className="service-modal">


                        <div className="service-modal-header">

                            <div>

                                <span>
                                    ADMIN
                                </span>

                                <h3>
                                    Add New Service
                                </h3>

                            </div>


                            <button
                                type="button"
                                onClick={closeAddModal}
                                disabled={saving}
                            >

                                <i className="ri-close-line"></i>

                            </button>

                        </div>


                        <form
                            className="service-form"
                            onSubmit={handleAddService}
                        >


                            <div className="service-form-group">

                                <label>
                                    Service Name
                                </label>

                                <input
                                    type="text"
                                    name="serviceName"
                                    value={
                                        formData.serviceName
                                    }
                                    onChange={
                                        handleFormChange
                                    }
                                    placeholder="e.g. Full Car Service"
                                />

                            </div>



                            <div className="service-form-group">

                                <label>
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={
                                        formData.description
                                    }
                                    onChange={
                                        handleFormChange
                                    }
                                    placeholder="Enter service description"
                                    rows="4"
                                />

                            </div>



                            <div className="service-form-row">


                                <div className="service-form-group">

                                    <label>
                                        Vehicle Type
                                    </label>

                                    <select
                                        name="vehicleType"
                                        value={
                                            formData.vehicleType
                                        }
                                        onChange={
                                            handleFormChange
                                        }
                                    >

                                        <option value="Car">
                                            Car
                                        </option>

                                        <option value="Bike">
                                            Bike
                                        </option>

                                    </select>

                                </div>



                                <div className="service-form-group">

                                    <label>
                                        Price
                                    </label>

                                    <input
                                        type="number"
                                        name="price"
                                        value={
                                            formData.price
                                        }
                                        onChange={
                                            handleFormChange
                                        }
                                        placeholder="e.g. 2499"
                                        min="0"
                                    />

                                </div>

                            </div>



                            <div className="service-form-group">

                                <label>
                                    Duration
                                </label>

                                <input
                                    type="text"
                                    name="duration"
                                    value={
                                        formData.duration
                                    }
                                    onChange={
                                        handleFormChange
                                    }
                                    placeholder="e.g. 2 Hours"
                                />

                            </div>



                            <div className="service-form-actions">

                                <button
                                    type="button"
                                    className="service-cancel-btn"
                                    onClick={closeAddModal}
                                    disabled={saving}
                                >

                                    Cancel

                                </button>


                                <button
                                    type="submit"
                                    className="service-submit-btn"
                                    disabled={saving}
                                >

                                    <i className="ri-add-line"></i>

                                    {saving
                                        ? "Adding..."
                                        : "Add Service"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}




            {showUpdateModal && (

                <div
                    className={`service-modal-overlay ${theme}`}
                    onMouseDown={(e) => {

                        if (
                            e.target === e.currentTarget
                        ) {

                            closeUpdateModal();

                        }

                    }}
                >

                    <div className="service-modal">


                        <div className="service-modal-header">

                            <div>

                                <span>
                                    ADMIN
                                </span>

                                <h3>
                                    Update Service
                                </h3>

                            </div>


                            <button
                                type="button"
                                onClick={closeUpdateModal}
                                disabled={saving}
                            >

                                <i className="ri-close-line"></i>

                            </button>

                        </div>


                        <form
                            className="service-form"
                            onSubmit={
                                handleUpdateService
                            }
                        >


                            <div className="service-form-group">

                                <label>
                                    Service Name
                                </label>

                                <input
                                    type="text"
                                    name="serviceName"
                                    value={
                                        formData.serviceName
                                    }
                                    onChange={
                                        handleFormChange
                                    }
                                    placeholder="e.g. Full Car Service"
                                />

                            </div>



                            <div className="service-form-group">

                                <label>
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={
                                        formData.description
                                    }
                                    onChange={
                                        handleFormChange
                                    }
                                    placeholder="Enter service description"
                                    rows="4"
                                />

                            </div>



                            <div className="service-form-row">


                                <div className="service-form-group">

                                    <label>
                                        Vehicle Type
                                    </label>

                                    <select
                                        name="vehicleType"
                                        value={
                                            formData.vehicleType
                                        }
                                        onChange={
                                            handleFormChange
                                        }
                                    >

                                        <option value="Car">
                                            Car
                                        </option>

                                        <option value="Bike">
                                            Bike
                                        </option>

                                    </select>

                                </div>



                                <div className="service-form-group">

                                    <label>
                                        Price
                                    </label>

                                    <input
                                        type="number"
                                        name="price"
                                        value={
                                            formData.price
                                        }
                                        onChange={
                                            handleFormChange
                                        }
                                        placeholder="e.g. 2499"
                                        min="0"
                                    />

                                </div>

                            </div>



                            <div className="service-form-group">

                                <label>
                                    Duration
                                </label>

                                <input
                                    type="text"
                                    name="duration"
                                    value={
                                        formData.duration
                                    }
                                    onChange={
                                        handleFormChange
                                    }
                                    placeholder="e.g. 2 Hours"
                                />

                            </div>



                            <div className="service-form-actions">

                                <button
                                    type="button"
                                    className="service-cancel-btn"
                                    onClick={
                                        closeUpdateModal
                                    }
                                    disabled={saving}
                                >

                                    Cancel

                                </button>


                                <button
                                    type="submit"
                                    className="service-submit-btn"
                                    disabled={saving}
                                >

                                    <i className="ri-save-line"></i>

                                    {saving
                                        ? "Updating..."
                                        : "Update Service"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </section>

    );

};


export default AllServices;