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


router.post(

    "/add",

    authMiddleware,

    roleMiddleware("customer"),

    createBooking

);


router.get(

    "/all",

    authMiddleware,

    roleMiddleware("customer"),

    getBookings

);



router.get(

    "/upcoming",

    authMiddleware,

    roleMiddleware("customer"),

    getUpcomingBookings

);


router.put(

    "/reschedule/:id",

    authMiddleware,

    roleMiddleware("customer"),

    rescheduleBooking

);


router.delete(

    "/cancel/:id",

    authMiddleware,

    roleMiddleware("customer"),

    cancelBooking

);


router.get(

    "/admin/all",

    authMiddleware,

    roleMiddleware("admin"),

    getAllBookings

);


router.put(

    "/admin/assign-mechanic/:id",

    authMiddleware,

    roleMiddleware("admin"),

    assignMechanic

);

router.put(

    "/admin/status/:id",

    authMiddleware,

    roleMiddleware("admin"),

    updateAdminBookingStatus

);


router.delete(

    "/admin/delete/:id",

    authMiddleware,

    roleMiddleware("admin"),

    deleteBooking

);


router.get(

    "/mechanic/assigned",

    authMiddleware,

    roleMiddleware("mechanic"),

    getMechanicBookings

);



router.put(

    "/mechanic/update/:id",

    authMiddleware,

    roleMiddleware("mechanic"),

    updateMechanicBooking

);



module.exports = router;