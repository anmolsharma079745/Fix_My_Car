const express = require("express");

const {
    getPublicStatistics
} = require("../../controllers/dashboardController/dashboardController");


const router = express.Router();



router.get(
    "/public-stats",
    getPublicStatistics
);


module.exports = router;