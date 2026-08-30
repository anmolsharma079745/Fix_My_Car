const express = require("express");

const router = express.Router();

const {
    createPaymentOrder,
    verifyPayment
} = require("../../controllers/paymentController/paymentController");

const authMiddleware = require("../../middleware/authMiddleware/authMiddleware");

const roleMiddleware = require("../../middleware/roleMiddleware/roleMiddleware");



router.post(
    "/create-order",
    authMiddleware,
    roleMiddleware("customer"),
    createPaymentOrder
);



router.post(
    "/verify",
    authMiddleware,
    roleMiddleware("customer"),
    verifyPayment
);


module.exports = router;