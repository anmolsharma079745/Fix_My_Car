const mongoose = require("mongoose");

const passwordResetSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },

        otp: {
            type: String,
            required: true
        },

        expiresAt: {
            type: Date,
            required: true
        }
    },
    {
        timestamps: true
    }
);

// OTP automatically delete ho jayega expiry ke baad
passwordResetSchema.index(
    { expiresAt: 1 },
    { expireAfterSeconds: 0 }
);

const PasswordReset = mongoose.model(
    "PasswordReset",
    passwordResetSchema
);

module.exports = PasswordReset;