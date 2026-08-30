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

router.get(
    "/dashboard",
    dashboard
);

router.get(
    "/customers",
    getAllCustomers
);

router.get(
    "/mechanics",
    getAllMechanics
);

router.get(
    "/services",
    getAllServices
);

router.get(
    "/assigned-mechanics",
    getAssignedMechanics
);

router.put(
    "/assign-mechanic/:id",
    assignMechanic
);

router.put(
    "/assign-mechanic-service/:id",
    assignMechanicToService
);

router.get(
    "/revenue",
    revenueAnalytics
);

module.exports = router;