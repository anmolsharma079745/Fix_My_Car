const express = require("express");

const {
    register,
    login,
    getAllUsers,
    deleteUser,
    editUser,
    sendPasswordResetOTP,
    resetPassword
} = require("../../controllers/authController/authController");

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/users", getAllUsers);

router.delete("/delete/:id", deleteUser);

router.put("/edit/:id", editUser);

router.post(
    "/forgot-password/send-otp",
    sendPasswordResetOTP
);

router.post(
    "/forgot-password/reset-password",
    resetPassword
);

module.exports = router;