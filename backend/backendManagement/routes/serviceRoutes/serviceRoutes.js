const express = require("express");
const router = express.Router();

const {
    createService,
    getServices,
    updateService,
    deleteService
} = require("../../controllers/serviceController/serviceController");

const authMiddleware = require("../../middleware/authMiddleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware/roleMiddleware");


// =====================================================
// ADMIN - CREATE SERVICE
// =====================================================

router.post(
    "/add",
    authMiddleware,
    roleMiddleware("admin"),
    createService
);


// =====================================================
// GET ALL SERVICES
// PUBLIC ROUTE
// =====================================================

router.get(
    "/all",
    getServices
);


// =====================================================
// ADMIN - UPDATE SERVICE
// =====================================================

router.put(
    "/update/:id",
    authMiddleware,
    roleMiddleware("admin"),
    updateService
);


// =====================================================
// ADMIN - DELETE SERVICE
// =====================================================

router.delete(
    "/delete/:id",
    authMiddleware,
    roleMiddleware("admin"),
    deleteService
);


module.exports = router;