import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ManageMechanics.css";
import "remixicon/fonts/remixicon.css";
import API_BASE_URL from "../../../services/Api/api";

const ManageMechanics = ({ theme }) => {

    // =====================================================
    // STATES
    // =====================================================

    const [mechanics, setMechanics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [editModal, setEditModal] = useState(false);
    const [editedData, setEditedData] = useState({});


    // =====================================================
    // FETCH MECHANICS
    // =====================================================

    useEffect(() => {
        fetchMechanics();
    }, []);


    const fetchMechanics = async () => {

    try {

        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {

            setError("Admin login token not found.");
            setLoading(false);

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

        const mechanicsData =
            response.data?.mechanics || [];

        console.log(
            "Mechanics Array:",
            mechanicsData
        );

        setMechanics(mechanicsData);

    } catch (error) {

        console.error(
            "Mechanics Error:",
            error.response?.data || error.message
        );

        setError(
            error.response?.data?.message ||
            "Unable to fetch mechanics."
        );

    } finally {

        setLoading(false);

    }

};


    // =====================================================
    // EDIT MECHANIC
    // =====================================================

    const handleEdit = (specificMechanic) => {

        console.log(
            "Selected Mechanic:",
            specificMechanic
        );

        setEditedData({
            ...specificMechanic
        });

        setEditModal(true);

    };


    // =====================================================
    // HANDLE INPUT CHANGE
    // =====================================================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setEditedData((previousData) => ({
            ...previousData,
            [name]: value
        }));

    };


    // =====================================================
    // UPDATE MECHANIC
    // =====================================================

    const handleUpdate = async (e) => {

        e.preventDefault();

        try {

            console.log(
                "Updating Mechanic:",
                editedData
            );

            if (!editedData._id) {

                setError(
                    "Mechanic ID not found."
                );

                return;
            }

            const token =
                localStorage.getItem("token");

            if (!token) {

                setError(
                    "Admin login token not found."
                );

                return;
            }

            const updateData = {

                name: editedData.name,

                email: editedData.email,

                phone: editedData.phone,

                specialization:
                    editedData.specialization,

                experience:
                    editedData.experience,

                status:
                    editedData.status

            };

            console.log(
                "Update Data:",
                updateData
            );


            const response = await axios.put(

                `${API_BASE_URL}/api/mechanic/update/${editedData._id}`,

                updateData,

                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }

            );


            console.log(
                "Update Response:",
                response.data
            );


            // Refresh mechanic list

            await fetchMechanics();


            // Close modal

            setEditModal(false);

            setEditedData({});


        } catch (error) {

            console.error(
                "Update Mechanic Error:",
                error.response?.data ||
                error.message
            );

            setError(
                error.response?.data?.message ||
                "Unable to update mechanic."
            );

        }

    };


    // =====================================================
    // DELETE MECHANIC
    // =====================================================

    const handleDelete = async (specificMechanic) => {

        try {

            console.log(
                "Deleting Mechanic:",
                specificMechanic
            );


            if (!specificMechanic?._id) {

                setError(
                    "Mechanic ID not found."
                );

                return;

            }


            const token =
                localStorage.getItem("token");


            if (!token) {

                setError(
                    "Admin login token not found."
                );

                return;

            }


            const confirmDelete =
                window.confirm(
                    `Are you sure you want to delete ${specificMechanic.name}?`
                );


            if (!confirmDelete) {
                return;
            }


            const response = await axios.delete(

                `${API_BASE_URL}/api/mechanic/delete/${specificMechanic._id}`,

                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }

            );


            console.log(
                "Delete Response:",
                response.data
            );


            // Refresh mechanic list

            await fetchMechanics();


        } catch (error) {

            console.error(
                "Delete Mechanic Error:",
                error.response?.data ||
                error.message
            );

            setError(
                error.response?.data?.message ||
                "Unable to delete mechanic."
            );

        }

    };


    // =====================================================
    // CLOSE MODAL
    // =====================================================

    const handleClose = () => {

        setEditModal(false);

        setEditedData({});

    };


    // =====================================================
    // JSX
    // =====================================================

    return (

        <section
            className={`manage-mechanics ${theme}`}
        >

            <div className="manage-mechanics-container">


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="manage-mechanics-header">

                    <div>

                        <span className="manage-mechanics-tag">
                            MECHANIC MANAGEMENT
                        </span>

                        <h2>
                            Manage Mechanics
                        </h2>

                        <p>
                            View and manage all registered mechanics.
                        </p>

                    </div>


                    {!loading && !error && (

                        <div className="mechanics-total">

                            <span>
                                Total Mechanics
                            </span>

                            <strong>
                                {mechanics.length}
                            </strong>

                        </div>

                    )}

                </div>


                {/* =================================================
                    CONTENT
                ================================================= */}

                <div className="manage-mechanics-content">


                    {/* LOADING */}

                    {loading && (

                        <div className="mechanics-message">

                            <i className="ri-loader-4-line"></i>

                            <span>
                                Loading mechanics...
                            </span>

                        </div>

                    )}


                    {/* ERROR */}

                    {!loading && error && (

                        <div className="mechanics-message error-message">

                            <i className="ri-error-warning-line"></i>

                            <span>
                                {error}
                            </span>

                        </div>

                    )}


                    {/* NO DATA */}

                    {!loading &&
                    !error &&
                    mechanics.length === 0 && (

                        <div className="mechanics-message">

                            <i className="ri-user-search-line"></i>

                            <span>
                                No mechanics registered yet.
                            </span>

                        </div>

                    )}


                    {/* =================================================
                        MECHANIC CARDS
                    ================================================= */}

                    {!loading &&
                    !error &&
                    mechanics.length > 0 && (

                        <div className="mechanics-grid">

                            {mechanics.map(
                                (specificMechanic) => (

                                <div
                                    key={
                                        specificMechanic._id
                                    }
                                    className="mechanic-card"
                                >


                                    {/* CARD TOP */}

                                    <div className="mechanic-card-top">

                                        <div className="mechanic-icon">

                                            <i className="ri-user-settings-line"></i>

                                        </div>


                                        <div className="mechanic-info">

                                            <h3>
                                                {
                                                    specificMechanic.name
                                                }
                                            </h3>

                                            <span>
                                                {
                                                    specificMechanic.specialization
                                                }
                                            </span>

                                        </div>

                                    </div>


                                    {/* DETAILS */}

                                    <div className="mechanic-details">

    <p>
        <span className="detail-label">
            <i className="ri-user-line"></i>
            Full Name
        </span>

        <strong>
            {specificMechanic.name}
        </strong>
    </p>

    <p>
        <span className="detail-label">
            <i className="ri-mail-line"></i>
            Email
        </span>

        <strong>
            {specificMechanic.email}
        </strong>
    </p>

    <p>
        <span className="detail-label">
            <i className="ri-phone-line"></i>
            Phone Number
        </span>

        <strong>
            {specificMechanic.phone}
        </strong>
    </p>

    <p>
        <span className="detail-label">
            <i className="ri-tools-line"></i>
            Specialization
        </span>

        <strong>
            {specificMechanic.specialization}
        </strong>
    </p>

    <p>
        <span className="detail-label">
            <i className="ri-award-line"></i>
            Experience
        </span>

        <strong>
            {specificMechanic.experience}
        </strong>
    </p>

    <p>
        <span className="detail-label">
            <i className="ri-checkbox-circle-line"></i>
            Status
        </span>

        <strong>
            {specificMechanic.status}
        </strong>
    </p>

</div>


                                    {/* BUTTONS */}

                                    <div className="card-buttons">

                                        <button
                                            type="button"
                                            className="edit-btn"
                                            onClick={() =>
                                                handleEdit(
                                                    specificMechanic
                                                )
                                            }
                                        >

                                            <i className="ri-edit-line"></i>

                                            Edit

                                        </button>


                                        <button
                                            type="button"
                                            className="delete-btn"
                                            onClick={() =>
                                                handleDelete(
                                                    specificMechanic
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

            </div>


            {/* =====================================================
                EDIT MODAL
            ===================================================== */}

            {editModal && (

                <div
                    className="mechanic-edit-overlay"
                    onClick={handleClose}
                >

                    <div
                        className="mechanic-edit-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >


                        {/* MODAL HEADER */}

                        <div className="edit-modal-header">

                            <div>

                                <span>
                                    MECHANIC MANAGEMENT
                                </span>

                                <h2>
                                    Edit Mechanic
                                </h2>

                            </div>


                            <button
                                type="button"
                                className="close-modal-btn"
                                onClick={handleClose}
                            >

                                <i className="ri-close-line"></i>

                            </button>

                        </div>


                        {/* FORM */}

                        <form
                            onSubmit={handleUpdate}
                        >


                            {/* NAME */}

                            <div className="edit-form-group">

                                <label>
                                    Full Name
                                </label>

                                <div className="edit-input-box">

                                    <i className="ri-user-line"></i>

                                    <input
                                        type="text"
                                        name="name"
                                        value={
                                            editedData.name ||
                                            ""
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Update mechanic name"
                                        required
                                    />

                                </div>

                            </div>


                            {/* EMAIL */}

                            <div className="edit-form-group">

                                <label>
                                    Email
                                </label>

                                <div className="edit-input-box">

                                    <i className="ri-mail-line"></i>

                                    <input
                                        type="email"
                                        name="email"
                                        value={
                                            editedData.email ||
                                            ""
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Update mechanic email"
                                        required
                                    />

                                </div>

                            </div>


                            {/* PHONE */}

                            <div className="edit-form-group">

                                <label>
                                    Phone Number
                                </label>

                                <div className="edit-input-box">

                                    <i className="ri-phone-line"></i>

                                    <input
                                        type="text"
                                        name="phone"
                                        value={
                                            editedData.phone ||
                                            ""
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Update phone number"
                                        required
                                    />

                                </div>

                            </div>


                            {/* SPECIALIZATION */}

                            <div className="edit-form-group">

                                <label>
                                    Specialization
                                </label>

                                <div className="edit-input-box">

                                    <i className="ri-tools-line"></i>

                                    <select
                                        name="specialization"
                                        value={
                                            editedData.specialization ||
                                            ""
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    >

                                        <option value="">
                                            Select specialization
                                        </option>

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

                            </div>


                            {/* EXPERIENCE */}

                            <div className="edit-form-group">

                                <label>
                                    Experience
                                </label>

                                <div className="edit-input-box">

                                    <i className="ri-award-line"></i>

                                    <input
                                        type="text"
                                        name="experience"
                                        value={
                                            editedData.experience ||
                                            ""
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Update experience"
                                        required
                                    />

                                </div>

                            </div>


                            {/* STATUS */}

                            <div className="edit-form-group">

                                <label>
                                    Status
                                </label>

                                <div className="edit-input-box">

                                    <i className="ri-checkbox-circle-line"></i>

                                    <select
                                        name="status"
                                        value={
                                            editedData.status ||
                                            "Available"
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    >

                                        <option value="Available">
                                            Available
                                        </option>

                                        <option value="Busy">
                                            Busy
                                        </option>

                                        <option value="Inactive">
                                            Inactive
                                        </option>

                                    </select>

                                </div>

                            </div>


                            {/* MODAL BUTTONS */}

                            <div className="edit-modal-buttons">

                                <button
                                    type="button"
                                    className="cancel-edit-btn"
                                    onClick={handleClose}
                                >

                                    <i className="ri-close-line"></i>

                                    Cancel

                                </button>


                                <button
                                    type="submit"
                                    className="save-edit-btn"
                                >

                                    <i className="ri-save-line"></i>

                                    Update

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </section>

    );

};

export default ManageMechanics;