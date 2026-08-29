import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "./servicesCard.css";


const ServiceCard = ({
    service,
    theme,
    onServiceUpdated
}) => {

    const navigate = useNavigate();

    const [showLoginPopup, setShowLoginPopup] = useState(false);

    const [showEditModal, setShowEditModal] = useState(false);

    const [loading, setLoading] = useState(false);

    const [deleteLoading, setDeleteLoading] = useState(false);

    const [error, setError] = useState("");

    const [editData, setEditData] = useState({

        serviceName: service?.serviceName || "",

        description: service?.description || "",

        price: service?.price || "",

        duration: service?.duration || "",

        vehicleType: service?.vehicleType || "Car"

    });


    // =====================================================
    // GET LOGGED IN USER
    // =====================================================

    const getUser = () => {

        try {

            const storedUser =
                localStorage.getItem("user");

            if (!storedUser) {

                return null;

            }

            return JSON.parse(storedUser);

        } catch (error) {

            console.error(
                "User Data Error:",
                error
            );

            return null;

        }

    };


    // =====================================================
    // CHECK ADMIN
    // =====================================================

    const user = getUser();

    const isAdmin =
        user?.role === "admin";


    // =====================================================
    // BOOK SERVICE
    // =====================================================

    const handleBookService = () => {

        const storedUser =
            localStorage.getItem("user");


        // USER NOT LOGGED IN

        if (!storedUser) {

            setShowLoginPopup(true);

            return;

        }


        try {

            const user =
                JSON.parse(storedUser);


            // CUSTOMER

            if (user?.role === "customer") {

                navigate(
                    `/customer-dashboard?section=book-service&serviceId=${service?._id}`
                );

                return;

            }


            // OTHER ROLE

            setShowLoginPopup(true);

        } catch (error) {

            console.error(
                "User Data Error:",
                error
            );

            localStorage.removeItem("user");

            setShowLoginPopup(true);

        }

    };


    // =====================================================
    // LOGIN
    // =====================================================

    const handleLogin = () => {

        setShowLoginPopup(false);

        navigate("/login");

    };


    // =====================================================
    // CLOSE LOGIN POPUP
    // =====================================================

    const closePopup = () => {

        setShowLoginPopup(false);

    };


    // =====================================================
    // EDIT INPUT CHANGE
    // =====================================================

    const handleEditChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setEditData((prev) => ({

            ...prev,

            [name]: value

        }));

    };


    // =====================================================
    // OPEN EDIT MODAL
    // =====================================================

    const openEditModal = () => {

        setError("");


        setEditData({

            serviceName:
                service?.serviceName || "",

            description:
                service?.description || "",

            price:
                service?.price || "",

            duration:
                service?.duration || "",

            vehicleType:
                service?.vehicleType || "Car"

        });


        setShowEditModal(true);

    };


    // =====================================================
    // CLOSE EDIT MODAL
    // =====================================================

    const closeEditModal = () => {

        if (loading) {

            return;

        }

        setShowEditModal(false);

        setError("");

    };


    // =====================================================
    // UPDATE SERVICE
    // =====================================================

    const handleUpdateService = async (e) => {

        e.preventDefault();


        try {

            setLoading(true);

            setError("");


            const token =
                localStorage.getItem("token");


            if (!token) {

                setError(
                    "Admin login token not found."
                );

                return;

            }


            if (
                !editData.serviceName.trim() ||
                !editData.description.trim() ||
                editData.price === "" ||
                !editData.duration.trim() ||
                !editData.vehicleType
            ) {

                setError(
                    "Please fill all service details."
                );

                return;

            }


            const response =
                await axios.put(

                    `http://localhost:5000/api/service/update/${service._id}`,

                    {

                        serviceName:
                            editData.serviceName.trim(),

                        description:
                            editData.description.trim(),

                        price:
                            Number(editData.price),

                        duration:
                            editData.duration.trim(),

                        vehicleType:
                            editData.vehicleType

                    },

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


            setShowEditModal(false);


            // Refresh services in AllServices

            if (onServiceUpdated) {

                await onServiceUpdated();

            }

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

            setLoading(false);

        }

    };


    // =====================================================
    // DELETE SERVICE
    // =====================================================

    const handleDeleteService = async () => {

        const confirmed =
            window.confirm(

                `Are you sure you want to delete "${service?.serviceName}"?`

            );


        if (!confirmed) {

            return;

        }


        try {

            setDeleteLoading(true);

            setError("");


            const token =
                localStorage.getItem("token");


            if (!token) {

                setError(
                    "Admin login token not found."
                );

                return;

            }


            const response =
                await axios.delete(

                    `http://localhost:5000/api/service/delete/${service._id}`,

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


            // Refresh service list

            if (onServiceUpdated) {

                await onServiceUpdated();

            }

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

            setDeleteLoading(false);

        }

    };


    return (

        <>

            {/* =================================================
                SERVICE CARD
            ================================================= */}

            <div
                className={`service-card ${theme}`}
            >


                {/* SERVICE ICON */}

                <div className="service-card-icon">

                    <i className="ri-tools-line"></i>

                </div>


                {/* SERVICE NAME */}

                <h3>

                    {service?.serviceName}

                </h3>


                {/* DESCRIPTION */}

                <p className="service-card-description">

                    {service?.description}

                </p>


                {/* VEHICLE TYPE */}

                <div className="service-vehicle-type">

    <i
        className={
            service?.vehicleType === "Bike"
                ? "ri-motorbike-line"
                : service?.vehicleType === "Both"
                    ? "ri-car-washing-line"
                    : "ri-car-line"
                    }
                ></i>

                <span>
                    {service?.vehicleType || "Car"}
                 </span>
            </div>


                {/* SERVICE DETAILS */}

                <div className="service-details">


                    {/* PRICE */}

                    <div className="service-detail-item">

                        <i className="ri-money-rupee-circle-line"></i>

                        <div className="service-detail-info">

                            <span>
                                Price
                            </span>

                            <strong>
                                {service?.price}
                            </strong>

                        </div>

                    </div>


                    {/* DURATION */}

                    <div className="service-detail-item">

                        <i className="ri-time-line"></i>

                        <div className="service-detail-info">

                            <span>
                                Duration
                            </span>

                            <strong>
                                {service?.duration}
                            </strong>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    BOOK BUTTON
                ================================================= */}

                <button
                    type="button"
                    className="service-book-btn"
                    onClick={handleBookService}
                >

                    <i className="ri-calendar-check-line"></i>

                    <span>
                        Book Now
                    </span>

                </button>


                {/* =================================================
                    ADMIN ACTIONS
                ================================================= */}

                {isAdmin && (

                    <div className="service-admin-actions">


                        {/* EDIT */}

                        <button
                            type="button"
                            className="service-edit-btn"
                            onClick={openEditModal}
                        >

                            <i className="ri-edit-line"></i>

                            Edit

                        </button>


                        {/* DELETE */}

                        <button
                            type="button"
                            className="service-delete-btn"
                            onClick={handleDeleteService}
                            disabled={deleteLoading}
                        >

                            <i className="ri-delete-bin-line"></i>

                            {deleteLoading
                                ? "Deleting..."
                                : "Delete"}

                        </button>

                    </div>

                )}


                {/* ERROR */}

                {error && !showEditModal && (

                    <div className="service-card-error">

                        <i className="ri-error-warning-line"></i>

                        <span>
                            {error}
                        </span>

                    </div>

                )}

            </div>


            {/* =====================================================
                LOGIN REQUIRED POPUP
            ===================================================== */}

            {showLoginPopup && (

                <div
                    className={`service-login-overlay ${theme}`}
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


            {/* =====================================================
                EDIT SERVICE MODAL
            ===================================================== */}

            {showEditModal && (

                <div
                    className={`service-edit-overlay ${theme}`}
                    onMouseDown={(e) => {

                        if (
                            e.target ===
                            e.currentTarget
                        ) {

                            closeEditModal();

                        }

                    }}
                >

                    <div className="service-edit-modal">


                        {/* HEADER */}

                        <div className="service-edit-modal-header">

                            <div>

                                <span>
                                    ADMIN
                                </span>

                                <h2>
                                    Edit Service
                                </h2>

                            </div>


                            <button
                                type="button"
                                onClick={closeEditModal}
                                disabled={loading}
                            >

                                <i className="ri-close-line"></i>

                            </button>

                        </div>


                        {/* FORM */}

                        <form
                            onSubmit={
                                handleUpdateService
                            }
                        >


                            {/* SERVICE NAME */}

                            <div className="service-form-group">

                                <label>
                                    Service Name
                                </label>

                                <input
                                    type="text"
                                    name="serviceName"
                                    value={
                                        editData.serviceName
                                    }
                                    onChange={
                                        handleEditChange
                                    }
                                    placeholder="Enter service name"
                                />

                            </div>


                            {/* DESCRIPTION */}

                            <div className="service-form-group">

                                <label>
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={
                                        editData.description
                                    }
                                    onChange={
                                        handleEditChange
                                    }
                                    placeholder="Enter service description"
                                    rows="4"
                                />

                            </div>


                            {/* PRICE + DURATION */}

                            <div className="service-form-row">


                                <div className="service-form-group">

                                    <label>
                                        Price
                                    </label>

                                    <input
                                        type="number"
                                        name="price"
                                        min="0"
                                        value={
                                            editData.price
                                        }
                                        onChange={
                                            handleEditChange
                                        }
                                        placeholder="2499"
                                    />

                                </div>


                                <div className="service-form-group">

                                    <label>
                                        Duration
                                    </label>

                                    <input
                                        type="text"
                                        name="duration"
                                        value={
                                            editData.duration
                                        }
                                        onChange={
                                            handleEditChange
                                        }
                                        placeholder="2 Hours"
                                    />

                                </div>

                            </div>


                            {/* VEHICLE TYPE */}

                            <div className="service-form-group">

                                <label>
                                    Vehicle Type
                                </label>

                                <select
                                    name="vehicleType"
                                    value={
                                        editData.vehicleType
                                    }
                                    onChange={
                                        handleEditChange
                                    }
                                >

                                    <option value="Car">
                                        Car
                                    </option>

                                    <option value="Bike">
                                        Bike
                                    </option>

                                    <option value="Both">
                                        Both
                                    </option>

                                </select>

                            </div>


                            {/* FORM ERROR */}

                            {error && (

                                <div className="service-edit-error">

                                    <i className="ri-error-warning-line"></i>

                                    <span>
                                        {error}
                                    </span>

                                </div>

                            )}


                            {/* BUTTONS */}

                            <div className="service-edit-actions">

                                <button
                                    type="button"
                                    className="service-edit-cancel"
                                    onClick={
                                        closeEditModal
                                    }
                                    disabled={loading}
                                >

                                    Cancel

                                </button>


                                <button
                                    type="submit"
                                    className="service-edit-save"
                                    disabled={loading}
                                >

                                    <i
                                        className={
                                            loading
                                                ? "ri-loader-4-line"
                                                : "ri-save-line"
                                        }
                                    ></i>

                                    {loading
                                        ? "Updating..."
                                        : "Update Service"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </>

    );

};


export default ServiceCard;