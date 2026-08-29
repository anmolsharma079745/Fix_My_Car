const mongoose = require("mongoose");


const bookingSchema = new mongoose.Schema(
    {

        // =====================================================
        // CUSTOMER
        // =====================================================

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },


        // =====================================================
        // VEHICLE
        // =====================================================

        vehicleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vehicle",
            required: true
        },


        // =====================================================
        // SERVICE
        // =====================================================

        serviceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Service",
            required: true
        },


        // =====================================================
        // ASSIGNED MECHANIC
        // =====================================================

        mechanicId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Mechanic",
            default: null
        },


        // =====================================================
        // BOOKING DATE
        // =====================================================

        bookingDate: {
            type: Date,
            required: true
        },


        // =====================================================
        // BOOKING TIME
        // =====================================================

        bookingTime: {
            type: String,
            required: true
        },


        // =====================================================
        // BOOKING STATUS
        // =====================================================

        status: {
            type: String,

            enum: [
                "pending",
                "confirmed",
                "In Progress",
                "Completed",
                "cancelled"
            ],

            default: "pending"
        },

        paymentStatus: { type: String, enum: [ "pending", "paid" ], default: "pending" },


        // =====================================================
        // MECHANIC NOTES
        // =====================================================

        notes: {
            type: String,
            default: ""
        }

    },

    {
        timestamps: true
    }
);


const bookingModel = mongoose.model(
    "Booking",
    bookingSchema
);


module.exports = bookingModel;