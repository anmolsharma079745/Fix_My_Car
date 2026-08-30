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



router.post(
    "/add",
    authMiddleware,
    roleMiddleware("customer"),
    upload.single("vehicleImage"),
    addVehicle
);



router.get(
    "/all",
    authMiddleware,
    roleMiddleware("customer"),
    getVehicles
);



router.put(
    "/update/:id",
    authMiddleware,
    roleMiddleware("customer"),
    upload.single("vehicleImage"),
    updateVehicle
);



router.delete(
    "/delete/:id",
    authMiddleware,
    roleMiddleware("customer"),
    deleteVehicle
);


module.exports = router;