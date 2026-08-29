import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MyVehicles.css";
import API_BASE_URL from "../../../services/Api/api";

const MyVehicles = ({ theme }) => {

    // =====================================================
    // STATES
    // =====================================================

    const [vehicles, setVehicles] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showModal, setShowModal] = useState(false);

    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);

    const [formData, setFormData] = useState({
        vehicleName: "",
        model: "",
        numberPlate: "",
        vehicleType: "Car",
        vehicleImage: null
    });
    const [imagePreview, setImagePreview] = useState("");
    const [saving, setSaving] = useState(false);


    // =====================================================
    // FETCH VEHICLES
    // =====================================================

    useEffect(() => {
        fetchVehicles();
    }, []);


    const fetchVehicles = async () => {

        try {

            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            if (!token) {

                setError("Login token not found.");
                return;

            }

            const response = await axios.get(
                `${API_BASE_URL}/api/vehicle/all`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log(
                "Vehicles Response:",
                response.data
            );

            setVehicles(
                response.data.vehicles || []
            );

        } catch (error) {

            console.error(
                "Fetch Vehicles Error:",
                error.response?.data || error.message
            );

            setError(
                error.response?.data?.message ||
                "Unable to fetch vehicles."
            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // HANDLE INPUT CHANGE
    // =====================================================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value
        }));

    };
    const handleImageChange = (e) => {

        const file = e.target.files[0];

        if (!file) {
            return;
        }

        // Image validation
        if (!file.type.startsWith("image/")) {

            alert("Please select a valid image.");

            return;
        }

        // 5 MB limit
        if (file.size > 5 * 1024 * 1024) {

            alert("Image size must be less than 5 MB.");

            return;
        }

        setFormData((previousData) => ({
            ...previousData,
            vehicleImage: file
        }));

        setImagePreview(
            URL.createObjectURL(file)
        );
    };


    // =====================================================
    // OPEN ADD MODAL
    // =====================================================

    const openAddModal = () => {

        setIsEditMode(false);
        setSelectedVehicle(null);

        setFormData({
            vehicleName: "",
            model: "",
            numberPlate: "",
            vehicleType: "Car",
            vehicleImage: null
        });
        setImagePreview("");

        setShowModal(true);

    };


    // =====================================================
    // OPEN EDIT MODAL
    // =====================================================

    const openEditModal = (vehicle) => {

        setIsEditMode(true);
        setSelectedVehicle(vehicle);

        setFormData({
            vehicleName: vehicle.vehicleName || "",
            model: vehicle.model || "",
            numberPlate: vehicle.numberPlate || "",
            vehicleType: vehicle.vehicleType || "Car",
            vehicleImage: null
        });
        setImagePreview(vehicle.vehicleImage || "");

        setShowModal(true);

    };


    // =====================================================
    // CLOSE MODAL
    // =====================================================

    const closeModal = () => {

        if (saving) {
            return;
        }

        setShowModal(false);
        setIsEditMode(false);
        setSelectedVehicle(null);

        setFormData({
            vehicleName: "",
            model: "",
            numberPlate: "",
            vehicleType: "Car",
            vehicleImage: null
        });
        setImagePreview("");
    };



    // =====================================================
    // ADD VEHICLE
    // =====================================================

    const addVehicle = async () => {

        try {

            setSaving(true);

            const token = localStorage.getItem("token");

            if (!token) {

                alert("Login token not found.");

                return;
            }


            const data = new FormData();

            data.append(
                "vehicleName",
                formData.vehicleName
            );

            data.append(
                "model",
                formData.model
            );

            data.append(
                "numberPlate",
                formData.numberPlate
            );

            data.append(
                "vehicleType",
                formData.vehicleType
            );


            if (formData.vehicleImage) {

                data.append(
                    "vehicleImage",
                    formData.vehicleImage
                );

            }


            const response = await axios.post(

                `${API_BASE_URL}/api/vehicle/add`,

                data,

                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }

            );


            console.log(
                "Vehicle Added:",
                response.data
            );


            setVehicles((previousVehicles) => [

                ...previousVehicles,

                response.data.vehicle

            ]);


            alert("Vehicle added successfully.");

            closeModal();


        } catch (error) {

            console.error(
                "Add Vehicle Error:",
                error.response?.data || error.message
            );

            alert(
                error.response?.data?.message ||
                "Unable to add vehicle."
            );

        } finally {

            setSaving(false);

        }

    };


    // =====================================================
    // UPDATE VEHICLE
    // =====================================================

    const updateVehicle = async () => {

        try {

            setSaving(true);

            const token = localStorage.getItem("token");

            if (!token) {

                alert("Login token not found.");

                return;
            }


            const data = new FormData();

            data.append(
                "vehicleName",
                formData.vehicleName
            );

            data.append(
                "model",
                formData.model
            );

            data.append(
                "numberPlate",
                formData.numberPlate
            );

            data.append(
                "vehicleType",
                formData.vehicleType
            );


            if (formData.vehicleImage) {

                data.append(
                    "vehicleImage",
                    formData.vehicleImage
                );

            }


            const response = await axios.put(

                `${API_BASE_URL}/api/vehicle/update/${selectedVehicle._id}`,

                data,

                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }

            );


            console.log(
                "Vehicle Updated:",
                response.data
            );


            setVehicles((previousVehicles) =>

                previousVehicles.map((vehicle) =>

                    vehicle._id === selectedVehicle._id

                        ? response.data.vehicle

                        : vehicle

                )

            );


            alert("Vehicle updated successfully.");

            closeModal();


        } catch (error) {

            console.error(
                "Update Vehicle Error:",
                error.response?.data || error.message
            );

            alert(
                error.response?.data?.message ||
                "Unable to update vehicle."
            );

        } finally {

            setSaving(false);

        }

    };


    // =====================================================
    // FORM SUBMIT
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        // ---------------------------------------------
        // Basic validation
        // ---------------------------------------------

        if (
            !formData.vehicleName.trim() ||
            !formData.model.trim() ||
            !formData.numberPlate.trim() ||
            !formData.vehicleType
        ) {

            alert("Please fill all vehicle details.");
            return;

        }


        if (isEditMode) {

            await updateVehicle();

        } else {

            await addVehicle();

        }

    };


    // =====================================================
    // DELETE VEHICLE
    // =====================================================

    const deleteVehicle = async (vehicleId) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this vehicle?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            const token = localStorage.getItem("token");

            if (!token) {

                alert("Login token not found.");
                return;

            }

            const response = await axios.delete(
                `${API_BASE_URL}/api/vehicle/delete/${vehicleId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log(
                "Vehicle Deleted:",
                response.data
            );


            // Remove vehicle from frontend
            setVehicles((previousVehicles) =>
                previousVehicles.filter(
                    (vehicle) =>
                        vehicle._id !== vehicleId
                )
            );


            alert("Vehicle deleted successfully.");

        } catch (error) {

            console.error(
                "Delete Vehicle Error:",
                error.response?.data || error.message
            );

            alert(
                error.response?.data?.message ||
                "Unable to delete vehicle."
            );

        }

    };


    // =====================================================
    // VEHICLE ICON
    // =====================================================

    const getVehicleIcon = (vehicleType) => {

        if (vehicleType === "Bike") {
            return "ri-motorbike-line";
        }

        return "ri-car-line";

    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <section id="my-vehicles" className={`my-vehicles ${theme}`}>

            <div className="my-vehicles-container">


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="my-vehicles-header">

                    <div>

                        <span className="my-vehicles-tag">
                            VEHICLE MANAGEMENT
                        </span>

                        <h2>
                            My Vehicles
                        </h2>

                        <p>
                            Add and manage your cars and bikes.
                        </p>

                    </div>


                    {/* ADD VEHICLE BUTTON */}

                    <button
                        className="add-vehicle-btn"
                        onClick={openAddModal}
                    >

                        <i className="ri-add-line"></i>

                        Add Vehicle

                    </button>

                </div>


                {/* =================================================
                    LOADING
                ================================================= */}

                {loading && (

                    <div className="vehicle-message">

                        <i className="ri-loader-4-line"></i>

                        <span>
                            Loading vehicles...
                        </span>

                    </div>

                )}


                {/* =================================================
                    ERROR
                ================================================= */}

                {!loading && error && (

                    <div className="vehicle-message vehicle-error">

                        <i className="ri-error-warning-line"></i>

                        <span>
                            {error}
                        </span>

                    </div>

                )}


                {/* =================================================
                    NO VEHICLES
                ================================================= */}

                {!loading &&
                    !error &&
                    vehicles.length === 0 && (

                        <div className="vehicle-message">

                            <i className="ri-car-line"></i>

                            <span>
                                You have not added any vehicle yet.
                            </span>

                            <button
                                className="empty-add-btn"
                                onClick={openAddModal}
                            >
                                <i className="ri-add-line"></i>
                                Add Your First Vehicle
                            </button>

                        </div>

                    )}


                {/* =================================================
                    VEHICLES
                ================================================= */}

                {!loading &&
                    !error &&
                    vehicles.length > 0 && (

                        <div className="vehicle-grid">

                            {vehicles.map((vehicle) => (

                                <div
                                    className="vehicle-card"
                                    key={vehicle._id}
                                >


                                    {/* CARD HEADER */}

                                    <div className="vehicle-card-header">

                                        <div className="vehicle-icon">

                                            {vehicle.vehicleImage ? (

                                                <img
                                                    src={vehicle.vehicleImage}
                                                    alt={vehicle.vehicleName}
                                                />

                                            ) : (

                                                <i
                                                    className={getVehicleIcon(
                                                        vehicle.vehicleType
                                                    )}
                                                ></i>

                                            )}

                                        </div>


                                        <div className="vehicle-title">

                                            <h3>
                                                {vehicle.vehicleName}
                                            </h3>

                                            <span>
                                                {vehicle.vehicleType}
                                            </span>

                                        </div>

                                    </div>


                                    {/* VEHICLE DETAILS */}

                                    <div className="vehicle-details">


                                        <div className="vehicle-detail-row">

                                            <span>
                                                <i className="ri-car-line"></i>
                                                Vehicle
                                            </span>

                                            <strong>
                                                {vehicle.vehicleName}
                                            </strong>

                                        </div>


                                        <div className="vehicle-detail-row">

                                            <span>
                                                <i className="ri-information-line"></i>
                                                Model
                                            </span>

                                            <strong>
                                                {vehicle.model}
                                            </strong>

                                        </div>


                                        <div className="vehicle-detail-row">

                                            <span>
                                                <i className="ri-price-tag-3-line"></i>
                                                Number Plate
                                            </span>

                                            <strong>
                                                {vehicle.numberPlate}
                                            </strong>

                                        </div>


                                        <div className="vehicle-detail-row">

                                            <span>
                                                <i className="ri-roadster-line"></i>
                                                Type
                                            </span>

                                            <strong>
                                                {vehicle.vehicleType}
                                            </strong>

                                        </div>

                                    </div>


                                    {/* CARD ACTIONS */}

                                    <div className="vehicle-actions">

                                        <button
                                            className="vehicle-edit-btn"
                                            onClick={() =>
                                                openEditModal(vehicle)
                                            }
                                        >

                                            <i className="ri-edit-line"></i>

                                            Edit

                                        </button>


                                        <button
                                            className="vehicle-delete-btn"
                                            onClick={() =>
                                                deleteVehicle(
                                                    vehicle._id
                                                )
                                            }
                                        >

                                            <i className="ri-delete-bin-line"></i>

                                            Delete

                                        </button>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

            </div>


            {/* =====================================================
                ADD / EDIT MODAL
            ===================================================== */}

            {showModal && (

                <div
                    className="vehicle-modal-overlay"
                    onClick={closeModal}
                >

                    <div
                        className="vehicle-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >


                        {/* MODAL HEADER */}

                        <div className="vehicle-modal-header">

                            <div>

                                <span>
                                    VEHICLE MANAGEMENT
                                </span>

                                <h3>
                                    {
                                        isEditMode
                                            ? "Edit Vehicle"
                                            : "Add Vehicle"
                                    }
                                </h3>

                            </div>


                            <button
                                className="vehicle-modal-close"
                                onClick={closeModal}
                                disabled={saving}
                            >

                                <i className="ri-close-line"></i>

                            </button>

                        </div>


                        {/* FORM */}

                        <form onSubmit={handleSubmit}>

                            {/* =====================================================
        VEHICLE IMAGE
    ===================================================== */}
                        <div className="vehicle-form-group">

    <label>
        Vehicle Image
    </label>

    <div className="vehicle-image-upload">

        {/* LEFT SIDE - ICON + BUTTON */}

        <div className="vehicle-image-left">

            <i className="ri-image-add-line"></i>

            <label className="vehicle-file-button">

                {imagePreview
                    ? "Change Image"
                    : "Choose File"}

                <input
                    type="file"
                    name="vehicleImage"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={saving}
                />

            </label>

        </div>


        {/* RIGHT SIDE - IMAGE PREVIEW */}

        <div className="vehicle-image-right">

            {imagePreview ? (

                <div className="vehicle-image-preview">

                    <img
                        src={imagePreview}
                        alt="Vehicle Preview"
                    />

                </div>

            ) : (

                <div className="vehicle-image-placeholder">

                    <i className="ri-image-line"></i>

                    <span>
                        No image
                    </span>

                </div>

            )}

        </div>

    </div>

</div>
                            


                            {/* =====================================================
        VEHICLE NAME
    ===================================================== */}

                            <div className="vehicle-form-group">

                                <label>
                                    Vehicle Name
                                </label>

                                <div className="vehicle-input-wrapper">

                                    <i className="ri-car-line"></i>

                                    <input
                                        type="text"
                                        name="vehicleName"
                                        value={formData.vehicleName}
                                        onChange={handleChange}
                                        placeholder="e.g. Tata Nexon"
                                        disabled={saving}
                                    />

                                </div>

                            </div>


                            {/* =====================================================
        MODEL
    ===================================================== */}

                            <div className="vehicle-form-group">

                                <label>
                                    Model
                                </label>

                                <div className="vehicle-input-wrapper">

                                    <i className="ri-information-line"></i>

                                    <input
                                        type="text"
                                        name="model"
                                        value={formData.model}
                                        onChange={handleChange}
                                        placeholder="e.g. 2024"
                                        disabled={saving}
                                    />

                                </div>

                            </div>


                            {/* =====================================================
        NUMBER PLATE
    ===================================================== */}

                            <div className="vehicle-form-group">

                                <label>
                                    Number Plate
                                </label>

                                <div className="vehicle-input-wrapper">

                                    <i className="ri-price-tag-3-line"></i>

                                    <input
                                        type="text"
                                        name="numberPlate"
                                        value={formData.numberPlate}
                                        onChange={handleChange}
                                        placeholder="e.g. HR01AB1234"
                                        disabled={saving}
                                    />

                                </div>

                            </div>


                            {/* =====================================================
        VEHICLE TYPE
    ===================================================== */}

                            <div className="vehicle-form-group">

                                <label>
                                    Vehicle Type
                                </label>

                                <div className="vehicle-input-wrapper">

                                    <i className="ri-roadster-line"></i>

                                    <select
                                        name="vehicleType"
                                        value={formData.vehicleType}
                                        onChange={handleChange}
                                        disabled={saving}
                                    >

                                        <option value="Car">
                                            Car
                                        </option>

                                        <option value="Bike">
                                            Bike
                                        </option>

                                    </select>

                                </div>

                            </div>


                            {/* =====================================================
        FORM ACTIONS
    ===================================================== */}

                            <div className="vehicle-modal-actions">

                                {/* CANCEL */}

                                <button
                                    type="button"
                                    className="vehicle-cancel-btn"
                                    onClick={closeModal}
                                    disabled={saving}
                                >

                                    <i className="ri-close-line"></i>

                                    Cancel

                                </button>


                                {/* SAVE */}

                                <button
                                    type="submit"
                                    className="vehicle-save-btn"
                                    disabled={saving}
                                >

                                    {saving ? (

                                        <>
                                            <i className="ri-loader-4-line"></i>
                                            Saving...
                                        </>

                                    ) : (

                                        <>
                                            <i className="ri-save-line"></i>

                                            {isEditMode
                                                ? "Save Changes"
                                                : "Add Vehicle"}
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

export default MyVehicles;