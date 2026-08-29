const express = require("express");

const {

    createBooking,

    getBookings,

    getUpcomingBookings,

    rescheduleBooking,

    cancelBooking,

    getAllBookings,

    assignMechanic,

    updateAdminBookingStatus,

    getMechanicBookings,

    updateMechanicBooking,

    deleteBooking

} = require("../../controllers/bookingController/bookingController");

const authMiddleware =
    require("../../middleware/authMiddleware/authMiddleware");

const roleMiddleware =
    require("../../middleware/roleMiddleware/roleMiddleware");

const router = express.Router();



// =====================================================
// CUSTOMER ROUTES
// =====================================================



// -----------------------------------------------------
// CREATE BOOKING
// -----------------------------------------------------

router.post(

    "/add",

    authMiddleware,

    roleMiddleware("customer"),

    createBooking

);



// -----------------------------------------------------
// GET CUSTOMER BOOKINGS
// -----------------------------------------------------

router.get(

    "/all",

    authMiddleware,

    roleMiddleware("customer"),

    getBookings

);



// -----------------------------------------------------
// GET CUSTOMER UPCOMING BOOKINGS
// -----------------------------------------------------

router.get(

    "/upcoming",

    authMiddleware,

    roleMiddleware("customer"),

    getUpcomingBookings

);



// -----------------------------------------------------
// RESCHEDULE BOOKING
// -----------------------------------------------------

router.put(

    "/reschedule/:id",

    authMiddleware,

    roleMiddleware("customer"),

    rescheduleBooking

);



// -----------------------------------------------------
// CANCEL BOOKING
// -----------------------------------------------------

router.delete(

    "/cancel/:id",

    authMiddleware,

    roleMiddleware("customer"),

    cancelBooking

);



// =====================================================
// ADMIN ROUTES
// =====================================================



// -----------------------------------------------------
// GET ALL BOOKINGS
// -----------------------------------------------------

router.get(

    "/admin/all",

    authMiddleware,

    roleMiddleware("admin"),

    getAllBookings

);



// -----------------------------------------------------
// ASSIGN / CHANGE MECHANIC
// -----------------------------------------------------

router.put(

    "/admin/assign-mechanic/:id",

    authMiddleware,

    roleMiddleware("admin"),

    assignMechanic

);



// -----------------------------------------------------
// UPDATE BOOKING STATUS
// ADMIN
// -----------------------------------------------------

router.put(

    "/admin/status/:id",

    authMiddleware,

    roleMiddleware("admin"),

    updateAdminBookingStatus

);



// -----------------------------------------------------
// DELETE BOOKING
// -----------------------------------------------------

router.delete(

    "/admin/delete/:id",

    authMiddleware,

    roleMiddleware("admin"),

    deleteBooking

);



// =====================================================
// MECHANIC ROUTES
// =====================================================



// -----------------------------------------------------
// GET ASSIGNED BOOKINGS
// -----------------------------------------------------

router.get(

    "/mechanic/assigned",

    authMiddleware,

    roleMiddleware("mechanic"),

    getMechanicBookings

);



// -----------------------------------------------------
// UPDATE ASSIGNED BOOKING
// STATUS + NOTES
// -----------------------------------------------------

router.put(

    "/mechanic/update/:id",

    authMiddleware,

    roleMiddleware("mechanic"),

    updateMechanicBooking

);



module.exports = router;