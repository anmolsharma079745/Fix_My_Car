const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        // CUSTOMER
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        // BOOKING
        bookingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
            required: true
        },

        // VEHICLE
        vehicleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vehicle",
            required: true
        },

        // SERVICE
        serviceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Service",
            required: true
        },

        // PAYMENT AMOUNT
        amount: {
            type: Number,
            required: true
        },

        // RAZORPAY ORDER
        razorpayOrderId: {
            type: String,
            required: true
        },

        // RAZORPAY PAYMENT
        razorpayPaymentId: {
            type: String,
            default: ""
        },

        // RAZORPAY SIGNATURE
        razorpaySignature: {
            type: String,
            default: ""
        },

        // PAYMENT STATUS
        status: {
            type: String,
            enum: [
                "pending",
                "paid",
                "failed"
            ],
            default: "pending"
        },

        // PAYMENT DATE
        paidAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

const paymentModel = mongoose.model(
    "Payment",
    paymentSchema
);

module.exports = paymentModel;