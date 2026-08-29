const express = require("express");

const {
    dashboard,
    assignMechanic,
    assignMechanicToService,
    getAssignedMechanics,
    getAllMechanics,
    getAllCustomers,
    getAllServices,
    revenueAnalytics
} = require("../../controllers/adminController/adminController");

const router = express.Router();


// =====================================================
// ADMIN DASHBOARD
// =====================================================

router.get(
    "/dashboard",
    dashboard
);


// =====================================================
// CUSTOMERS
// =====================================================

router.get(
    "/customers",
    getAllCustomers
);


// =====================================================
// MECHANICS
// =====================================================

router.get(
    "/mechanics",
    getAllMechanics
);


// =====================================================
// SERVICES
// =====================================================

router.get(
    "/services",
    getAllServices
);


// =====================================================
// ASSIGNED MECHANICS
// =====================================================

router.get(
    "/assigned-mechanics",
    getAssignedMechanics
);


// =====================================================
// ASSIGN MECHANIC TO BOOKING
// =====================================================

router.put(
    "/assign-mechanic/:id",
    assignMechanic
);


// =====================================================
// ASSIGN MECHANIC TO SERVICE
// =====================================================

router.put(
    "/assign-mechanic-service/:id",
    assignMechanicToService
);


// =====================================================
// REVENUE ANALYTICS
// =====================================================

router.get(
    "/revenue",
    revenueAnalytics
);


// =====================================================
// EXPORT
// =====================================================

module.exports = router;