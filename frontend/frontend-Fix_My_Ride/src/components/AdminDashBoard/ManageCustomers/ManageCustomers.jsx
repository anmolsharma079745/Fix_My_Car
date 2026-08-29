import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ManageCustomers.css";

const ManageCustomer = ({ theme }) => {

    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ================= EDIT STATES =================

    const [editModal, setEditModal] = useState(false);
    const [editedData, setEditedData] = useState({});

    // ================= FETCH CUSTOMERS =================

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {

        try {

            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            if (!token) {
                setError("Admin login token not found.");
                return;
            }

            const response = await axios.get(
                "http://localhost:5000/api/admin/customers",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log("Customers Response:", response.data);

            setCustomers(response.data.customers || []);

        } catch (error) {

            console.error(
                "Customers Error:",
                error.response?.data || error.message
            );

            setError(
                error.response?.data?.message ||
                "Unable to fetch customers."
            );

        } finally {

            setLoading(false);

        }

    };


    // ================= DELETE CUSTOMER =================

    const handleDelete = async (specificCustomer) => {

        try {

            console.log("Deleting Customer:", specificCustomer);

            const token = localStorage.getItem("token");

            if (!token) {
                setError("Admin login token not found.");
                return;
            }

            const confirmDelete = window.confirm(
                `Are you sure you want to delete ${specificCustomer.name}?`
            );

            if (!confirmDelete) {
                return;
            }

            await axios.delete(
                `http://localhost:5000/api/admin/customers/${specificCustomer._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log("Customer deleted successfully");

            // Delete hone ke baad customers dobara fetch
            fetchCustomers();

        } catch (error) {

            console.error(
                "Delete Customer Error:",
                error.response?.data || error.message
            );

            setError(
                error.response?.data?.message ||
                "Unable to delete customer."
            );

        }

    };


    // ================= OPEN EDIT MODAL =================

    const handleEdit = (specificCustomer) => {

        console.log("Edit Customer:", specificCustomer);

        // Selected customer ka data form me daal do
        setEditedData({
            _id: specificCustomer._id,
            name: specificCustomer.name || "",
            email: specificCustomer.email || "",
            phone: specificCustomer.phone || "",
            role: specificCustomer.role || "customer"
        });

        // Modal open
        setEditModal(true);

    };


    // ================= HANDLE INPUT CHANGE =================

    const handleChange = (e) => {

        setEditedData({
            ...editedData,
            [e.target.name]: e.target.value
        });

    };


    // ================= UPDATE CUSTOMER =================

    const handleUpdate = async (e) => {

        e.preventDefault();

        try {

            console.log("Updating Customer:", editedData);

            const token = localStorage.getItem("token");

            if (!token) {
                setError("Admin login token not found.");
                return;
            }

            await axios.put(
                `http://localhost:5000/api/admin/customers/${editedData._id}`,
                {
                    name: editedData.name,
                    email: editedData.email,
                    phone: editedData.phone,
                    role: editedData.role
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log("Customer updated successfully");

            // Modal close
            setEditModal(false);

            // Form clear
            setEditedData({});

            // Updated data dobara fetch
            fetchCustomers();

        } catch (error) {

            console.error(
                "Update Customer Error:",
                error.response?.data || error.message
            );

            setError(
                error.response?.data?.message ||
                "Unable to update customer."
            );

        }

    };


    // ================= CLOSE MODAL =================

    const handleClose = () => {

        setEditModal(false);
        setEditedData({});

    };


    return (

        <section className={`manage-customer ${theme}`}>

            <div className="manage-customer-container">

                {/* ================= HEADER ================= */}

                <div className="manage-customer-header">

                    <div>

                        <span className="manage-customer-tag">
                            USER MANAGEMENT
                        </span>

                        <h2>
                            Manage Customers
                        </h2>

                        <p>
                            View and manage all registered customers.
                        </p>

                    </div>


                    {!loading && !error && (

                        <div className="customer-total">

                            <span>
                                Total Customers
                            </span>

                            <strong>
                                {customers.length}
                            </strong>

                        </div>

                    )}

                </div>


                {/* ================= CONTENT ================= */}

                <div className="manage-customer-content">

                    {/* ================= LOADING ================= */}

                    {loading && (

                        <div className="customer-message">

                            <i className="ri-loader-4-line"></i>

                            <span>
                                Loading customers...
                            </span>

                        </div>

                    )}


                    {/* ================= ERROR ================= */}

                    {!loading && error && (

                        <div className="customer-message error-message">

                            <i className="ri-error-warning-line"></i>

                            <span>
                                {error}
                            </span>

                        </div>

                    )}


                    {/* ================= NO DATA ================= */}

                    {!loading &&
                    !error &&
                    customers.length === 0 && (

                        <div className="customer-message">

                            <i className="ri-user-search-line"></i>

                            <span>
                                No customers registered yet.
                            </span>

                        </div>

                    )}


                    {/* ================= CUSTOMER CARDS ================= */}

                    {!loading &&
                    !error &&
                    customers.length > 0 && (

                        <div className="customer-grid">

                            {customers.map((specificCustomer) => (

                                <div
                                    key={specificCustomer._id}
                                    className="customer-card"
                                >

                                    {/* CUSTOMER DETAILS */}

                                    <div className="customer-card-top">

                                        <div className="customer-icon">

                                            <i className="ri-user-3-line"></i>

                                        </div>

                                        <div className="customer-info">

                                            <h3>
                                                {specificCustomer.name}
                                            </h3>

                                            <span>
                                                {specificCustomer.email}
                                            </span>

                                        </div>

                                    </div>


                                    <div className="customer-details">

                                        <p>

                                            <strong>
                                                Full Name:
                                            </strong>

                                            {specificCustomer.name}

                                        </p>


                                        <p>

                                            <strong>
                                                Email:
                                            </strong>

                                            {specificCustomer.email}

                                        </p>


                                        <p>

                                            <strong>
                                                Phone Number:
                                            </strong>

                                            {specificCustomer.phone || "N/A"}

                                        </p>


                                        <p>

                                            <strong>
                                                Registered As:
                                            </strong>

                                            {specificCustomer.role || "customer"}

                                        </p>


                                        <p>

                                            <strong>
                                                Joined:
                                            </strong>

                                            {specificCustomer.createdAt
                                                ? new Date(
                                                    specificCustomer.createdAt
                                                ).toLocaleDateString("en-IN")
                                                : "N/A"
                                            }

                                        </p>

                                    </div>


                                    {/* ================= BUTTONS ================= */}

                                    <div className="card-buttons">

                                        <button
                                            className="edit-btn"
                                            onClick={() =>
                                                handleEdit(specificCustomer)
                                            }
                                        >

                                            <i className="ri-edit-line"></i>

                                            Edit

                                        </button>


                                        <button
                                            className="delete-btn"
                                            onClick={() =>
                                                handleDelete(specificCustomer)
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
                EDIT CUSTOMER MODAL
            ===================================================== */}

            {editModal && (

                <div className="customer-edit-overlay">

                    <div className="customer-edit-modal">

                        {/* MODAL HEADER */}

                        <div className="edit-modal-header">

                            <div>

                                <span>
                                    CUSTOMER MANAGEMENT
                                </span>

                                <h2>
                                    Edit Customer
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


                        {/* EDIT FORM */}

                        <form onSubmit={handleUpdate}>

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
                                        value={editedData.name || ""}
                                        onChange={handleChange}
                                        placeholder="Enter customer name"
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
                                        value={editedData.email || ""}
                                        onChange={handleChange}
                                        placeholder="Enter customer email"
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
                                        value={editedData.phone || ""}
                                        onChange={handleChange}
                                        placeholder="Enter phone number"
                                    />

                                </div>

                            </div>


                            {/* ROLE */}

                            <div className="edit-form-group">

                                <label>
                                    Role
                                </label>

                                <div className="edit-input-box">

                                    <i className="ri-shield-user-line"></i>

                                    <select
                                        name="role"
                                        value={editedData.role || "customer"}
                                        onChange={handleChange}
                                    >

                                        <option value="customer">
                                            Customer
                                        </option>

                                        <option value="mechanic">
                                            Mechanic
                                        </option>

                                        <option value="admin">
                                            Admin
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

                                    Update Customer

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </section>

    );

};

export default ManageCustomer;