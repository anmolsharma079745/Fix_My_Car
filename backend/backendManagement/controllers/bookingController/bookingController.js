const bookingModel = require("../../models/bookingModel/bookingModel");
const mechanicModel = require("../../models/mechanicModel/mechanicModel");



const allowedBookingStatuses = [
    "pending",
    "confirmed",
    "In Progress",
    "Completed",
    "cancelled"
];



const createBooking = async (req, res) => {

    try {

        const {
            vehicleId,
            serviceId,
            bookingDate,
            bookingTime
        } = req.body;



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




const newBookingDate = new Date(
    `${bookingDate}T${bookingTime}`
);


if (isNaN(newBookingDate.getTime())) {

    return res.status(400).json({
        message: "Invalid booking date or time"
    });

}



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



        const booking = new bookingModel({

            userId: req.user.id,

            vehicleId,

            serviceId,

            bookingDate: newBookingDate,

            bookingTime,

            mechanicId: null,

            status: "pending",


            paymentStatus: "pending",

            notes: ""

        });


        await booking.save();



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




const rescheduleBooking = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            bookingDate,
            bookingTime
        } = req.body;



        if (!bookingDate || !bookingTime) {

            return res.status(400).json({

                message:
                    "New booking date and time are required"

            });

        }



        const newBookingDate = new Date(
            `${bookingDate}T${bookingTime}`
        );


        if (isNaN(newBookingDate.getTime())) {

            return res.status(400).json({

                message:
                    "Invalid booking date or time"

            });

        }



        if (newBookingDate <= new Date()) {

            return res.status(400).json({

                message:
                    "New booking date and time must be in the future"

            });

        }



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



        if (
            booking.status !== "pending" &&
            booking.status !== "confirmed"
        ) {

            return res.status(400).json({

                message:
                    "Only pending or confirmed bookings can be rescheduled"

            });

        }



        booking.bookingDate =
            newBookingDate;



        booking.bookingTime =
            bookingTime;



        await booking.save();



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




const assignMechanic = async (req, res) => {

    try {

        const { id } = req.params;

        const { mechanicId } = req.body;



        if (!mechanicId) {

            return res.status(400).json({

                message:
                    "Mechanic ID is required"

            });

        }



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




const updateAdminBookingStatus = async (req, res) => {

    try {

        const { id } = req.params;

        const { status } = req.body;



        if (!status) {

            return res.status(400).json({

                message:
                    "Booking status is required"

            });

        }



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



        const booking =
            await bookingModel.findById(id);


        if (!booking) {

            return res.status(404).json({

                message:
                    "Booking not found"

            });

        }



        booking.status =
            status;



        if (status === "Completed") {

            if (booking.paymentStatus !== "paid") {

                booking.paymentStatus =
                    "pending";

            }

        }


        await booking.save();



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




const getMechanicBookings = async (req, res) => {

    try {


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




const updateMechanicBooking = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            status,
            notes
        } = req.body;



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



        if (status) {

            booking.status =
                status;



            if (status === "Completed") {

                if (booking.paymentStatus !== "paid") {

                    booking.paymentStatus =
                        "pending";

                }

            }

        }



        if (notes !== undefined) {

            booking.notes =
                notes;

        }


        await booking.save();



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