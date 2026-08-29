const express = require("express");
const router = express.Router();

const { addMechanic, getMechanics, updateMechanic, deleteMechanic } = require("../../controllers/mechanicController/mechanicController");
const authMiddleware = require("../../middleware/authMiddleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware/roleMiddleware");

router.post("/add", addMechanic);
router.get( "/all", authMiddleware, roleMiddleware("admin"), getMechanics );
router.put( "/update/:id", authMiddleware, roleMiddleware("admin"), updateMechanic );
router.delete( "/delete/:id", authMiddleware, roleMiddleware("admin"), deleteMechanic);

module.exports = router;