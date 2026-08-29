const bookingModel = require("../../models/bookingModel/bookingModel");
const mechanicModel = require("../../models/mechanicModel/mechanicModel");


// =====================================================
// COMMON STATUS
// =====================================================

const allowedBookingStatuses = [
    "pending",
    "confirmed",
    "In Progress",
    "Completed",
    "cancelled"
];


// =====================================================
// CREATE BOOKING - CUSTOMER
// =====================================================

const createBooking = async (req, res) => {

    try {

        const {
            vehicleId,
            serviceId,
            bookingDate,
            bookingTime
        } = req.body;


        // =================================================
        // VALIDATION
        // =================================================

        if (
            !vehicleId ||
            !serviceId ||
            !bookingDate ||
            !bookingTime
        ) {

            return res.status(400).json({
                message:
                    "Vehicle, service, booking date and booking time are required"
            });

        }


        // =================================================
        // VALIDATE DATE
        // =================================================

        // =================================================
// VALIDATE DATE + TIME
// =================================================

const newBookingDate = new Date(
    `${bookingDate}T${bookingTime}`
);


if (isNaN(newBookingDate.getTime())) {

    return res.status(400).json({
        message: "Invalid booking date or time"
    });

}


// =================================================
// BOOKING TIME MUST BE AT LEAST 1 MINUTE FUTURE
// =================================================

const minimumBookingTime = new Date();

minimumBookingTime.setMinutes(
    minimumBookingTime.getMinutes() + 1
);


if (newBookingDate < minimumBookingTime) {

    return res.status(400).json({
        message:
            "Booking time must be at least 1 minute from now"
    });

}


        // =================================================
        // CREATE BOOKING
        // =================================================

        const booking = new bookingModel({

            userId: req.user.id,

            vehicleId,

            serviceId,

            bookingDate: newBookingDate,

            bookingTime,

            mechanicId: null,

            status: "pending",

            // =================================================
            // PAYMENT STATUS
            // Payment will happen AFTER service completion
            // =================================================

            paymentStatus: "pending",

            notes: ""

        });


        await booking.save();


        // =================================================
        // RESPONSE
        // =================================================

        res.status(201).json({

            message:
                "Booking created successfully",

            booking

        });


    } catch (error) {

        console.error(
            "Create Booking Error:",
            error
        );


        res.status(500).json({

            message:
                "Error creating booking",

            error: error.message

        });

    }
};



// =====================================================
// GET CUSTOMER BOOKINGS
// =====================================================

const getBookings = async (req, res) => {

    try {

        const bookings = await bookingModel

            .find({
                userId: req.user.id
            })

            .populate("vehicleId")

            .populate("serviceId")

            .populate("mechanicId")

            .sort({
                bookingDate: -1
            });


        res.status(200).json({

            message:
                "Bookings retrieved successfully",

            bookings

        });


    } catch (error) {

        console.error(
            "Get Bookings Error:",
            error
        );


        res.status(500).json({

            message:
                "Error retrieving bookings",

            error: error.message

        });

    }

};



// =====================================================
// GET UPCOMING BOOKINGS
// CUSTOMER DASHBOARD
// =====================================================

const getUpcomingBookings = async (req, res) => {

    try {

        const currentDate = new Date();


        const bookings = await bookingModel

            .find({

                userId: req.user.id,

                bookingDate: {
                    $gte: currentDate
                },

                status: {
                    $in: [
                        "pending",
                        "confirmed",
                        "In Progress"
                    ]
                }

            })

            .populate("vehicleId")

            .populate("serviceId")

            .populate("mechanicId")

            .sort({
                bookingDate: 1
            });


        res.status(200).json({

            message:
                "Upcoming Services Retrieved Successfully",

            bookings

        });


    } catch (error) {

        console.error(
            "Upcoming Booking Error:",
            error
        );


        res.status(500).json({

            message:
                "Error retrieving upcoming services",

            error: error.message

        });

    }

};



// =====================================================
// RESCHEDULE BOOKING - CUSTOMER
// =====================================================

const rescheduleBooking = async (req, res) => {

    try {

        const { id } = req.params;

        const { bookingDate } = req.body;


        // =================================================
        // VALIDATION
        // =================================================

        if (!bookingDate) {

            return res.status(400).json({

                message:
                    "New booking date and time are required"

            });

        }


        // =================================================
        // VALIDATE DATE
        // =================================================

        const newBookingDate =
            new Date(bookingDate);


        if (
            isNaN(
                newBookingDate.getTime()
            )
        ) {

            return res.status(400).json({

                message:
                    "Invalid booking date"

            });

        }


        // =================================================
        // DATE MUST BE FUTURE
        // =================================================

        if (
            newBookingDate <= new Date()
        ) {

            return res.status(400).json({

                message:
                    "New booking date must be in the future"

            });

        }


        // =================================================
        // FIND CUSTOMER BOOKING
        // =================================================

        const booking =
            await bookingModel.findOne({

                _id: id,

                userId: req.user.id

            });


        if (!booking) {

            return res.status(404).json({

                message:
                    "Booking not found"

            });

        }


        // =================================================
        // ONLY PENDING / CONFIRMED
        // =================================================

        if (

            booking.status !== "pending" &&

            booking.status !== "confirmed"

        ) {

            return res.status(400).json({

                message:
                    "Only pending or confirmed bookings can be rescheduled"

            });

        }


        // =================================================
        // UPDATE DATE
        // =================================================

        booking.bookingDate =
            newBookingDate;


        // =================================================
        // UPDATE TIME
        // =================================================

        booking.bookingTime =
            newBookingDate.toLocaleTimeString(
                "en-IN",
                {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false
                }
            );


        await booking.save();


        // =================================================
        // RESPONSE
        // =================================================

        res.status(200).json({

            message:
                "Booking rescheduled successfully",

            booking

        });


    } catch (error) {

        console.error(
            "Reschedule Booking Error:",
            error
        );


        res.status(500).json({

            message:
                "Error rescheduling booking",

            error: error.message

        });

    }

};



// =====================================================
// CANCEL BOOKING - CUSTOMER
// =====================================================

const cancelBooking = async (req, res) => {

    try {

        const { id } = req.params;


        const booking =
            await bookingModel.findOne({

                _id: id,

                userId: req.user.id

            });


        if (!booking) {

            return res.status(404).json({

                message:
                    "Booking Not Found"

            });

        }


        // =================================================
        // CHECK STATUS
        // =================================================

        if (
            booking.status === "Completed" ||
            booking.status === "cancelled"
        ) {

            return res.status(400).json({

                message:
                    "This booking cannot be cancelled"

            });

        }


        booking.status =
            "cancelled";


        await booking.save();


        res.status(200).json({

            message:
                "Booking Cancelled Successfully",

            booking

        });


    } catch (error) {

        console.error(
            "Cancel Booking Error:",
            error
        );


        res.status(500).json({

            message:
                "Internal Server Error",

            error: error.message

        });

    }

};



// =====================================================
// GET ALL BOOKINGS - ADMIN
// =====================================================

const getAllBookings = async (req, res) => {

    try {

        const bookings =
            await bookingModel

                .find()

                .populate("userId")

                .populate("vehicleId")

                .populate("serviceId")

                .populate("mechanicId")

                .sort({

                    bookingDate: 1

                });


        res.status(200).json({

            message:
                "All Bookings Retrieved Successfully",

            bookings

        });


    } catch (error) {

        console.error(
            "Get All Bookings Error:",
            error
        );


        res.status(500).json({

            message:
                "Error retrieving all bookings",

            error: error.message

        });

    }

};



// =====================================================
// ASSIGN MECHANIC - ADMIN
// =====================================================

const assignMechanic = async (req, res) => {

    try {

        const { id } = req.params;

        const { mechanicId } = req.body;


        // =================================================
        // VALIDATION
        // =================================================

        if (!mechanicId) {

            return res.status(400).json({

                message:
                    "Mechanic ID is required"

            });

        }


        // =================================================
        // CHECK MECHANIC
        // =================================================

        const mechanic =
            await mechanicModel.findById(
                mechanicId
            );


        if (!mechanic) {

            return res.status(404).json({

                message:
                    "Mechanic not found"

            });

        }


        // =================================================
        // UPDATE BOOKING
        // =================================================

        const booking =
            await bookingModel.findByIdAndUpdate(

                id,

                {

                    mechanicId,

                    status: "confirmed"

                },

                {

                    new: true,

                    runValidators: true

                }

            );


        if (!booking) {

            return res.status(404).json({

                message:
                    "Booking not found"

            });

        }


        // =================================================
        // RESPONSE
        // =================================================

        res.status(200).json({

            message:
                "Mechanic assigned successfully",

            booking

        });


    } catch (error) {

        console.error(
            "Assign Mechanic Error:",
            error
        );


        res.status(500).json({

            message:
                "Error assigning mechanic",

            error: error.message

        });

    }

};



// =====================================================
// UPDATE BOOKING STATUS - ADMIN
// =====================================================

const updateAdminBookingStatus = async (req, res) => {

    try {

        const { id } = req.params;

        const { status } = req.body;


        // =================================================
        // VALIDATION
        // =================================================

        if (!status) {

            return res.status(400).json({

                message:
                    "Booking status is required"

            });

        }


        // =================================================
        // CHECK STATUS
        // =================================================

        if (
            !allowedBookingStatuses.includes(status)
        ) {

            return res.status(400).json({

                message:
                    "Invalid booking status",

                allowedStatuses:
                    allowedBookingStatuses

            });

        }


        // =================================================
        // FIND BOOKING
        // =================================================

        const booking =
            await bookingModel.findById(id);


        if (!booking) {

            return res.status(404).json({

                message:
                    "Booking not found"

            });

        }


        // =================================================
        // UPDATE STATUS
        // =================================================

        booking.status =
            status;


        // =================================================
        // IMPORTANT
        // =================================================
        // Completing service DOES NOT mean payment is done.
        //
        // paymentStatus will remain "pending" until
        // customer successfully pays.
        // =================================================

        if (status === "Completed") {

            if (booking.paymentStatus !== "paid") {

                booking.paymentStatus =
                    "pending";

            }

        }


        await booking.save();


        // =================================================
        // RESPONSE
        // =================================================

        res.status(200).json({

            message:
                "Booking status updated successfully",

            booking

        });


    } catch (error) {

        console.error(
            "Update Admin Booking Status Error:",
            error
        );


        res.status(500).json({

            message:
                "Error updating booking status",

            error: error.message

        });

    }

};



// =====================================================
// GET MECHANIC ASSIGNED BOOKINGS
// =====================================================

const getMechanicBookings = async (req, res) => {

    try {

        // =================================================
        // FIND MECHANIC PROFILE
        // =================================================

        const mechanic =
            await mechanicModel.findOne({

                userId: req.user.id

            });


        if (!mechanic) {

            return res.status(404).json({

                message:
                    "Mechanic profile not found"

            });

        }


        // =================================================
        // GET ASSIGNED BOOKINGS
        // =================================================

        const bookings =
            await bookingModel

                .find({

                    mechanicId:
                        mechanic._id

                })

                .populate(
                    "userId",
                    "name email phone"
                )

                .populate(
                    "vehicleId"
                )

                .populate(
                    "serviceId"
                )

                .populate(
                    "mechanicId"
                )

                .sort({

                    bookingDate: 1

                });


        res.status(200).json({

            message:
                "Assigned bookings retrieved successfully",

            bookings

        });


    } catch (error) {

        console.error(
            "Get Mechanic Bookings Error:",
            error
        );


        res.status(500).json({

            message:
                "Error retrieving assigned bookings",

            error: error.message

        });

    }

};



// =====================================================
// UPDATE BOOKING STATUS + NOTES
// MECHANIC
// =====================================================

const updateMechanicBooking = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            status,
            notes
        } = req.body;


        // =================================================
        // FIND MECHANIC PROFILE
        // =================================================

        const mechanic =
            await mechanicModel.findOne({

                userId: req.user.id

            });


        if (!mechanic) {

            return res.status(404).json({

                message:
                    "Mechanic profile not found"

            });

        }


        // =================================================
        // VALIDATE STATUS
        // =================================================

        if (
            status &&
            !allowedBookingStatuses.includes(status)
        ) {

            return res.status(400).json({

                message:
                    "Invalid booking status",

                allowedStatuses:
                    allowedBookingStatuses

            });

        }


        // =================================================
        // FIND ONLY ASSIGNED BOOKING
        // =================================================

        const booking =
            await bookingModel.findOne({

                _id: id,

                mechanicId:
                    mechanic._id

            });


        if (!booking) {

            return res.status(404).json({

                message:
                    "Booking not found or not assigned to you"

            });

        }


        // =================================================
        // UPDATE STATUS
        // =================================================

        if (status) {

            booking.status =
                status;


            // =================================================
            // IMPORTANT PAYMENT LOGIC
            // =================================================
            // When mechanic completes service,
            // payment is NOT automatically completed.
            //
            // Customer must pay from Current Booking.
            // =================================================

            if (status === "Completed") {

                if (booking.paymentStatus !== "paid") {

                    booking.paymentStatus =
                        "pending";

                }

            }

        }


        // =================================================
        // UPDATE NOTES
        // =================================================

        if (notes !== undefined) {

            booking.notes =
                notes;

        }


        await booking.save();


        // =================================================
        // RESPONSE
        // =================================================

        res.status(200).json({

            message:
                "Booking updated successfully",

            booking

        });


    } catch (error) {

        console.error(
            "Update Mechanic Booking Error:",
            error
        );


        res.status(500).json({

            message:
                "Error updating booking",

            error: error.message

        });

    }

};



// =====================================================
// DELETE BOOKING - ADMIN
// =====================================================

const deleteBooking = async (req, res) => {

    try {

        const { id } = req.params;


        const booking =
            await bookingModel.findByIdAndDelete(
                id
            );


        if (!booking) {

            return res.status(404).json({

                message:
                    "Booking not found"

            });

        }


        res.status(200).json({

            message:
                "Booking deleted successfully",

            booking

        });

    } catch (error) {

        console.error(
            "Delete Booking Error:",
            error
        );


        res.status(500).json({

            message:
                "Error deleting booking",

            error: error.message

        });

    }

};



// =====================================================
// EXPORTS
// =====================================================

module.exports = {

    createBooking,

    getBookings,

    getUpcomingBookings,

    rescheduleBooking,

    cancelBooking,

    getAllBookings,

    assignMechanic,

    updateAdminBookingStatus,

    getMechanicBookings,

    updateMechanicBooking,

    deleteBooking

};