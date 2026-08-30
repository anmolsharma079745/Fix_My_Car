const mongoose = require("mongoose");

const mechanicSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        phone: {
            type: String,
            required: true
        },
        specialization: {
            type: String,
            enum: ["Car", "Bike", "Both"]
        },
        experience: {
            type: String
        },
        status: {
            type: String,
            enum: ["Available", "Busy", "Inactive"],
            default: "Available"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Mechanic", mechanicSchema);