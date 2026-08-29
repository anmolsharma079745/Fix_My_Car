const express = require("express");

const router = express.Router();

const {
    addVehicle,
    getVehicles,
    updateVehicle,
    deleteVehicle
} = require("../../controllers/vehicleController/vehicleController");

const authMiddleware = require("../../middleware/authMiddleware/authMiddleware");

const roleMiddleware = require("../../middleware/roleMiddleware/roleMiddleware");

const upload = require("../../middleware/uploadMiddleware/uploadMiddleware");


// =====================================================
// ADD VEHICLE
// =====================================================

router.post(
    "/add",
    authMiddleware,
    roleMiddleware("customer"),
    upload.single("vehicleImage"),
    addVehicle
);


// =====================================================
// GET VEHICLES
// =====================================================

router.get(
    "/all",
    authMiddleware,
    roleMiddleware("customer"),
    getVehicles
);


// =====================================================
// UPDATE VEHICLE
// =====================================================

router.put(
    "/update/:id",
    authMiddleware,
    roleMiddleware("customer"),
    upload.single("vehicleImage"),
    updateVehicle
);


// =====================================================
// DELETE VEHICLE
// =====================================================

router.delete(
    "/delete/:id",
    authMiddleware,
    roleMiddleware("customer"),
    deleteVehicle
);


module.exports = router;