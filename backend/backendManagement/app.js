const express = require("express");
const authRoutes= require("./routes/authRoutes/authRoutes")
const testRoutes = require("./routes/testRoutes/testRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes/vehicleRoutes");
const serviceRoutes = require("./routes/serviceRoutes/serviceRoutes");
const bookingRoutes = require("./routes/bookingRoutes/bookingRoutes");
const mechanicsRoutes = require("./routes/mechanicRoutes/mechanicRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes/dashboardRoutes");
const adminRoutes=require("./routes/adminRoutes/adminRoutes")
const paymentRoutes = require("./routes/paymentRoutes/paymentRoutes");
const cors=require("cors")
const app = express();
app.use(cors())
app.get("/", (req, res) => {
    res.send("Fix My Ride Backend is running");
});
app.use(express.json());
app.use("/api/auth",authRoutes)
app.use("/api/test",testRoutes)
app.use("/api/booking", bookingRoutes);
app.use("/api/service", serviceRoutes);
app.use("/api/vehicle", vehicleRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/dashboard",dashboardRoutes);
app.use("/api/mechanic", mechanicsRoutes);
app.use("/api/admin",adminRoutes)

module.exports = app;