const userModel = require("../../models/userModel/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const PasswordReset = require("../../models/passwordResetModel/passwordResetModel");
const sendOTPEmail = require("../../utils/sendEmail/sendEmail");

const register = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            phone,
            role
        } = req.body;
        const emailExist = await userModel.findOne({ email });
        if (emailExist) {
            return res.status(400).json({
                message: "Email Already Exists"
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userModel.create({
            name,
            email,
            password: hashedPassword,
            phone,
            role
        });
        const userObject = user.toObject();
        delete userObject.password;
        delete userObject.__v;
        return res.status(201).json({
            message: "User Registered Successfully",
            user: userObject
        });
    } catch (err) {
        console.log("REGISTER ERROR:", err);
        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
};

const login = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }
        const existEmail = await userModel.findOne({ email: email.trim() });
        if (!existEmail) {
            return res.status(404).json({
                message: "User Not Found"
            });
        }
        const passwordMatch = await bcrypt.compare( password, existEmail.password );
        if (!passwordMatch) {
            return res.status(400).json({
                message: "Invalid Password"
            });
        }
        const token = jwt.sign(
            {
                id: existEmail._id,
                role: existEmail.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        const userObject = existEmail.toObject();
        delete userObject.password;
        delete userObject.__v;

        return res.status(200).json({
            message: "Login Successful",
            token,
            user: userObject
        });
    } catch (err) {
        console.log("LOGIN ERROR:", err);
        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find();
        return res.status(200).json({
            message: "Users Fetched Successfully",
            users
        });
    } 
    catch (err) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await userModel.findByIdAndDelete( req.params.id );
        if (!user) {
            return res.status(404).json({
                message: "User Not Found"
            });
        }
        return res.status(200).json({
            message: "User Deleted Successfully"
        });
    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
};

const editUser = async (req, res) => {
    try {
        const user =await userModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!user) {
            return res.status(404).json({
                message: "User Not Found"
            });
        }
        return res.status(200).json({
            message: "User Updated Successfully",
            user
        });
    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
};

const sendPasswordResetOTP = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                message: "Email is required"
            });
        }
        const cleanEmail = email.trim().toLowerCase();
        const user = await userModel.findOne({ email: cleanEmail });
        if (!user) {
            return res.status(404).json({
                message: "Email is not registered"
            });
        }
        const otp = Math.floor(100000 + Math.random() * 900000 ).toString();
        const expiresAt = new Date( Date.now() + 10 * 60 * 1000 );
        await PasswordReset.deleteMany({ email: cleanEmail });
        await PasswordReset.create({
            email: cleanEmail,
            otp,
            expiresAt
        });

        await sendOTPEmail(
            cleanEmail,
            otp
        );

        return res.status(200).json({
            message: "OTP sent successfully"
        });

    } catch (err) {
        console.log( "SEND OTP ERROR:", err );
        return res.status(500).json({
            message: "Failed to send OTP",
            error: err.message
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        const {
            email,
            newPassword,
            confirmPassword,
            otp
        } = req.body;
        if ( !email || !newPassword || !confirmPassword || !otp ){
            return res.status(400).json({
                 message: "All fields are required"
            });
        }
        if ( newPassword !== confirmPassword ){
            return res.status(400).json({
                message: "Your password is not valid"
            });
        }
        const cleanEmail = email.trim().toLowerCase();
        const user = await userModel.findOne({ email: cleanEmail });
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        const samePassword = await bcrypt.compare( newPassword, user.password );
        if (samePassword) {
            return res.status(400).json({
                message: "New password cannot be your current password"
            });
        }
        const resetData = await PasswordReset.findOne({ email: cleanEmail });
        if (!resetData) {
            return res.status(400).json({
                message: "OTP is invalid or expired"
            });
        }
        if( resetData.expiresAt < new Date() ){
            await PasswordReset.deleteMany({
                email: cleanEmail
            });
            return res.status(400).json({
                message: "OTP has expired"
            });
        }
        if( resetData.otp !== otp ){
            return res.status(400).json({
                message: "Invalid OTP"
            });
        }
        const hashedPassword = await bcrypt.hash( newPassword, 10 );
        user.password = hashedPassword;
        await user.save();

        await PasswordReset.deleteMany({
            email: cleanEmail
        });
        return res.status(200).json({
            message: "Password changed successfully"
        });
    }
    catch (err) {
        console.log( "RESET PASSWORD ERROR:", err );
        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
};

module.exports = {
    register,
    login,
    getAllUsers,
    deleteUser,
    editUser,
    sendPasswordResetOTP,
    resetPassword
};