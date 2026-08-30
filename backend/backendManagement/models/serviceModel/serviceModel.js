const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({

    serviceName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    duration: {
        type: String,
        required: true,
        trim: true
    },
    vehicleType: {
        type: String,
        enum: [
            "Car",
            "Bike"
        ],
        required: true
    },
    mechanicId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Mechanic",
        default: null
    }
}, {
    timestamps: true
});

module.exports =
    mongoose.model(
        "Service",
        serviceSchema
    );