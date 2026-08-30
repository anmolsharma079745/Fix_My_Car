const mongoose = require("mongoose");


const bookingSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        vehicleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vehicle",
            required: true
        },
        serviceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Service",
            required: true
        },
        mechanicId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Mechanic",
            default: null
        },
        bookingDate: {
            type: Date,
            required: true
        },
        bookingTime: {
            type: String,
            required: true
        },
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