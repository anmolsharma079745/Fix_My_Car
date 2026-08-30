import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ManageServices.css";
import "remixicon/fonts/remixicon.css";
import API_BASE_URL from "../../../services/Api/api";
const SERVICE_API = `${API_BASE_URL}/api/service`;
const MECHANIC_API = `${API_BASE_URL}/api/mechanic`;

const ManageServices = ({ theme }) => {
    const [services, setServices] = useState([]);
    const [mechanics, setMechanics] = useState([]);

    const [loading, setLoading] = useState(true);
    const [mechanicsLoading, setMechanicsLoading] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        serviceName: "",
        description: "",
        price: "",
        duration: "",
        mechanicId: ""
    });

    const getToken = () => {
        return localStorage.getItem("token");
    };

    useEffect(() => {
        fetchServices();
        fetchMechanics();
    }, []);

    const fetchServices = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(`${SERVICE_API}/all`);

            setServices(response.data.services || []);
        } catch (err) {
            console.error(
                "Fetch Services Error:",
                err.response?.data || err.message
            );

            setError(
                err.response?.data?.message ||
                "Unable to fetch services."
            );
        } finally {
            setLoading(false);
        }
    };

    const fetchMechanics = async () => {
        try {
            setMechanicsLoading(true);

            const token = getToken();

            if (!token) {
                return;
            }

            const response = await axios.get(
                `${MECHANIC_API}/all`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const mechanicList =
                response.data.mechanics ||
                response.data.users ||
                response.data.data ||
                [];

            setMechanics(mechanicList);
        } catch (err) {
            console.error(
                "Fetch Mechanics Error:",
                err.response?.data || err.message
            );
        } finally {
            setMechanicsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const resetForm = () => {
        setFormData({
            serviceName: "",
            description: "",
            price: "",
            duration: "",
            mechanicId: ""
        });

        setEditingId(null);
        setIsEditing(false);
    };

    const openAddModal = () => {
        resetForm();

        setError("");
        setSuccess("");

        setShowModal(true);
    };

    const openEditModal = (service) => {
        setFormData({
            serviceName: service.serviceName || "",
            description: service.description || "",
            price: service.price ?? "",
            duration: service.duration || "",
            mechanicId:
                service.mechanicId?._id ||
                service.mechanicId ||
                ""
        });

        setEditingId(service._id);
        setIsEditing(true);

        setError("");
        setSuccess("");

        setShowModal(true);
    };

    const closeModal = () => {
        if (saving) {
            return;
        }

        setShowModal(false);
        resetForm();
    };

    const validateForm = () => {
        if (!formData.serviceName.trim()) {
            setError("Please enter service name.");
            return false;
        }

        if (!formData.description.trim()) {
            setError("Please enter service description.");
            return false;
        }

        if (
            formData.price === "" ||
            Number(formData.price) < 0
        ) {
            setError("Please enter a valid service price.");
            return false;
        }

        if (!formData.duration.trim()) {
            setError("Please enter service duration.");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!validateForm()) {
            return;
        }

        const token = getToken();

        if (!token) {
            setError("Admin login token not found.");
            return;
        }

        try {
            setSaving(true);

            const data = {
                serviceName: formData.serviceName.trim(),
                description: formData.description.trim(),
                price: Number(formData.price),
                duration: formData.duration.trim(),
                mechanicId: formData.mechanicId || null
            };

            if (isEditing) {
                const response = await axios.put(
                    `${SERVICE_API}/update/${editingId}`,
                    data,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const updatedService = response.data.service;

                setServices((prev) =>
                    prev.map((service) =>
                        service._id === editingId
                            ? updatedService
                            : service
                    )
                );

                setSuccess("Service updated successfully.");
            } else {
                const response = await axios.post(
                    `${SERVICE_API}/add`,
                    data,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const newService = response.data.service;

                setServices((prev) => [
                    newService,
                    ...prev
                ]);

                setSuccess("Service added successfully.");
            }

            setTimeout(() => {
                setShowModal(false);
                resetForm();
                setSuccess("");
            }, 700);
        } catch (err) {
            console.error(
                "Save Service Error:",
                err.response?.data || err.message
            );

            setError(
                err.response?.data?.message ||
                "Unable to save service."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this service?"
        );

        if (!confirmDelete) {
            return;
        }

        const token = getToken();

        if (!token) {
            setError("Admin login token not found.");
            return;
        }

        try {
            setError("");
            setSuccess("");

            await axios.delete(
                `${SERVICE_API}/delete/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setServices((prev) =>
                prev.filter(
                    (service) => service._id !== id
                )
            );

            setSuccess("Service deleted successfully.");

            setTimeout(() => {
                setSuccess("");
            }, 2000);
        } catch (err) {
            console.error(
                "Delete Service Error:",
                err.response?.data || err.message
            );

            setError(
                err.response?.data?.message ||
                "Unable to delete service."
            );
        }
    };

    const formatPrice = (price) => {
        if (
            price === undefined ||
            price === null ||
            price === ""
        ) {
            return "N/A";
        }

        return `${Number(price).toLocaleString("en-IN")}`;
    };

    return (
        <section
            className={`manage-services ${
                theme === "dark" ? "dark" : "light"
            }`}
        >
            <div className="manage-services-container">

                <div className="manage-services-header">

                    <div>
                        <span className="manage-services-tag">
                            SERVICE MANAGEMENT
                        </span>

                        <h2>Manage Services</h2>

                        <p>
                            Add, update and delete
                            customer vehicle services.
                        </p>
                    </div>

                    <div className="manage-services-header-actions">

                        {!loading && !error && (
                            <div className="services-total">
                                <span>Total Services</span>

                                <strong>
                                    {services.length}
                                </strong>
                            </div>
                        )}

                        <button
                            type="button"
                            className="add-service-btn"
                            onClick={openAddModal}
                        >
                            <i className="ri-add-line"></i>
                            Add Service
                        </button>
                    </div>
                </div>

                {success && (
                    <div className="services-alert success-alert">
                        <i className="ri-checkbox-circle-line"></i>
                        <span>{success}</span>
                    </div>
                )}

                {error && !showModal && (
                    <div className="services-alert error-alert">
                        <i className="ri-error-warning-line"></i>
                        <span>{error}</span>
                    </div>
                )}

                <div className="manage-services-content">

                    {loading && (
                        <div className="services-message">
                            <i className="ri-loader-4-line"></i>
                            <span>Loading services...</span>
                        </div>
                    )}

                    {!loading &&
                    !error &&
                    services.length === 0 && (
                        <div className="services-empty">

                            <div className="empty-icon">
                                <i className="ri-service-line"></i>
                            </div>

                            <h3>No Services Available</h3>

                            <p>
                                Start by adding your
                                first vehicle service.
                            </p>

                            <button
                                type="button"
                                onClick={openAddModal}
                                className="empty-add-btn"
                            >
                                <i className="ri-add-line"></i>
                                Add First Service
                            </button>
                        </div>
                    )}

                    {!loading &&
                    !error &&
                    services.length > 0 && (
                        <div className="services-grid">

                            {services.map((service) => (
                                <div
                                    className="service-card"
                                    key={service._id}
                                >


                                    <div className="service-card-top">

                                        <div className="service-icon">
                                            <i className="ri-tools-line"></i>
                                        </div>

                                        <div className="service-info">
                                            <h3>
                                                {service.serviceName ||
                                                    "Service"}
                                            </h3>

                                            <span>
                                                Vehicle Service
                                            </span>
                                        </div>

                                    </div>

                                    <div className="service-details">

                                        <div className="price-duration-row">

                                            <div className="service-detail">
                                                <span>
                                                    <i className="ri-money-rupee-circle-line"></i>
                                                    Price
                                                </span>

                                                <strong className="price-value">
                                                    {formatPrice(
                                                        service.price
                                                    )}
                                                </strong>
                                            </div>

                                            <div className="service-detail">
                                                <span>
                                                    <i className="ri-time-line"></i>
                                                    Duration
                                                </span>

                                                <strong className="duration-value">
                                                    {service.duration ||
                                                        "N/A"}
                                                </strong>
                                            </div>

                                        </div>

                                        <div className="service-description">

                                            <span>
                                                <i className="ri-file-text-line"></i>
                                                Description
                                            </span>

                                            <p className="discription-content">
                                                {service.description ||
                                                    "No description available."}
                                            </p>

                                        </div>

                                    </div>

                                    <div className="service-card-footer">

                                        <span className="service-status">
                                            <i className="ri-checkbox-circle-line"></i>
                                            Available
                                        </span>

                                        <div className="service-actions">

                                            <button
                                                type="button"
                                                className="service-edit-btn"
                                                onClick={() =>
                                                    openEditModal(service)
                                                }
                                                title="Edit Service"
                                            >
                                                <i className="ri-edit-line"></i>
                                                <span>Edit</span>
                                            </button>

                                            <button
                                                type="button"
                                                className="service-delete-btn"
                                                onClick={() =>
                                                    handleDelete(
                                                        service._id
                                                    )
                                                }
                                                title="Delete Service"
                                            >
                                                <i className="ri-delete-bin-line"></i>
                                                <span>Delete</span>
                                            </button>

                                        </div>

                                    </div>

                                </div>
                            ))}

                        </div>
                    )}

                </div>
            </div>

            {showModal && (
                <div
                    className="service-modal-overlay"
                    onMouseDown={(e) => {
                        if (
                            e.target === e.currentTarget &&
                            !saving
                        ) {
                            closeModal();
                        }
                    }}
                >

                    <div className="service-modal">

                        <div className="service-modal-header">

                            <div>
                                <span className="modal-label">
                                    {isEditing
                                        ? "UPDATE SERVICE"
                                        : "NEW SERVICE"}
                                </span>

                                <h3>
                                    {isEditing
                                        ? "Edit Service"
                                        : "Add Service"}
                                </h3>
                            </div>

                            <button
                                type="button"
                                className="modal-close-btn"
                                onClick={closeModal}
                                disabled={saving}
                            >
                                <i className="ri-close-line"></i>
                            </button>

                        </div>

                        {error && (
                            <div className="modal-error">
                                <i className="ri-error-warning-line"></i>
                                <span>{error}</span>
                            </div>
                        )}

                        <form
                            className="service-form"
                            onSubmit={handleSubmit}
                        >

                            <div className="form-group">
                                <label>Service Name</label>

                                <div className="input-wrapper">
                                    <i className="ri-tools-line"></i>

                                    <input
                                        type="text"
                                        name="serviceName"
                                        value={formData.serviceName}
                                        onChange={handleChange}
                                        placeholder="e.g. Full Car Service"
                                        disabled={saving}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Description</label>

                                <div className="input-wrapper textarea-wrapper">
                                    <i className="ri-file-text-line"></i>

                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Enter service description"
                                        rows="4"
                                        disabled={saving}
                                    />
                                </div>
                            </div>

                            <div className="form-row">

                                <div className="form-group">
                                    <label>Price</label>

                                    <div className="input-wrapper">
                                        <i className="ri-money-rupee-circle-line"></i>

                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleChange}
                                            placeholder="e.g. 1500"
                                            min="0"
                                            disabled={saving}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Duration</label>

                                    <div className="input-wrapper">
                                        <i className="ri-time-line"></i>

                                        <input
                                            type="text"
                                            name="duration"
                                            value={formData.duration}
                                            onChange={handleChange}
                                            placeholder="e.g. 2 hours"
                                            disabled={saving}
                                        />
                                    </div>
                                </div>

                            </div>
                            <div className="form-group">

                                <label>Assign Mechanic</label>

                                <div className="input-wrapper">
                                    <i className="ri-user-settings-line"></i>

                                    <select
                                        name="mechanicId"
                                        value={formData.mechanicId}
                                        onChange={handleChange}
                                        disabled={
                                            saving ||
                                            mechanicsLoading
                                        }
                                    >
                                        <option value="">
                                            No Mechanic Assigned
                                        </option>

                                        {mechanics
                                            .filter(
                                                (mechanic) =>
                                                    mechanic.status !==
                                                    "Inactive"
                                            )
                                            .map((mechanic) => (
                                                <option
                                                    key={mechanic._id}
                                                    value={mechanic._id}
                                                >
                                                    {mechanic.name ||
                                                        "Mechanic"}
                                                    {" - "}
                                                    {mechanic.specialization ||
                                                        "General"}
                                                    {" ("}
                                                    {mechanic.status ||
                                                        "Available"}
                                                    {")"}
                                                </option>
                                            ))}
                                    </select>
                                </div>

                                <small className="mechanic-help-text">
                                    {mechanicsLoading
                                        ? "Loading mechanics..."
                                        : mechanics.length === 0
                                            ? "No mechanics available."
                                            : "Mechanic assignment is optional. You can assign or change it later."}
                                </small>

                            </div>

                            <div className="service-form-actions">

                                <button
                                    type="button"
                                    className="cancel-service-btn"
                                    onClick={closeModal}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="save-service-btn"
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <>
                                            <i className="ri-loader-4-line"></i>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <i
                                                className={
                                                    isEditing
                                                        ? "ri-save-line"
                                                        : "ri-add-line"
                                                }
                                            ></i>

                                            {isEditing
                                                ? "Update Service"
                                                : "Add Service"}
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

export default ManageServices;