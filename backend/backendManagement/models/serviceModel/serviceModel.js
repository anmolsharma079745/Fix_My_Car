const mongoose = require("mongoose");


const serviceSchema = new mongoose.Schema({

    // =====================================================
    // SERVICE NAME
    // =====================================================

    serviceName: {

        type: String,

        required: true,

        trim: true

    },


    // =====================================================
    // SERVICE DESCRIPTION
    // =====================================================

    description: {

        type: String,

        required: true,

        trim: true

    },


    // =====================================================
    // SERVICE PRICE
    // =====================================================

    price: {

        type: Number,

        required: true,

        min: 0

    },


    // =====================================================
    // SERVICE DURATION
    // =====================================================

    duration: {

        type: String,

        required: true,

        trim: true

    },


    // =====================================================
    // VEHICLE TYPE
    // Car / Bike
    // =====================================================

    vehicleType: {

        type: String,

        enum: [

            "Car",

            "Bike"

        ],

        required: true

    },


    // =====================================================
    // MECHANIC
    // Existing field - kept for compatibility
    // =====================================================

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