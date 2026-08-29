const express = require("express");

const {
    getPublicStatistics
} = require("../../controllers/dashboardController/dashboardController");


const router = express.Router();


// =====================================================
// PUBLIC HOME PAGE STATISTICS
// =====================================================

router.get(
    "/public-stats",
    getPublicStatistics
);


module.exports = router;