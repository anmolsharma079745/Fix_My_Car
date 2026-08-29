const userModel = require("../../models/userModel/userModel");
const vehicleModel = require("../../models/vehicleModel/vehicleModel");
const serviceModel = require("../../models/serviceModel/serviceModel");
const bookingModel = require("../../models/bookingModel/bookingModel");
const mechanicModel = require("../../models/mechanicModel/mechanicModel");


const dashboard = async (req, res) => {
    try {
        const totalUsers = await userModel.countDocuments();
        const totalCustomers = await userModel.countDocuments({ role: "customer" });
        const totalMechanics = await userModel.countDocuments({ role: "mechanic" });
        const totalAdmins = await userModel.countDocuments({ role: "admin" });
        const totalVehicles = await vehicleModel.countDocuments();
        const totalServices = await serviceModel.countDocuments();
        const totalBookings = await bookingModel.countDocuments();
        res.status(200).json({
            message:
                "Dashboard Data Fetched Successfully",
            data: {
                totalUsers,
                totalCustomers,
                totalMechanics,
                totalAdmins,
                totalVehicles,
                totalServices,
                totalBookings
            }
        });
    } catch (err) {
        console.error( "Dashboard Error:", err );
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
};

const getAllCustomers = async (req, res) => {
    try {
        const customers =
            await userModel
                .find({ role: "customer" })
                .select("-password")
                .sort({ createdAt: -1 });
        res.status(200).json({
            message: "All Customers Retrieved Successfully", customers
        });
    }
    catch (error) {
        console.error( "Get Customers Error:", error );
        res.status(500).json({
            message: "Error retrieving customers",
            error: error.message
        });
    }
};

const assignMechanic = async (req, res) => {
    try {
        const { id } = req.params;
        const { mechanicId } = req.body;
        if (!mechanicId) {
            return res.status(400).json({
                message: "Mechanic ID is required"
            });
        }
        const mechanic = await userModel.findOne({
                _id: mechanicId,
                role: "mechanic"
            });
        if (!mechanic) {
            return res.status(404).json({
                message: "Mechanic not found"
            });
        }
        const booking = await bookingModel.findById(id);
        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }
        booking.mechanicId = mechanicId;
        booking.status = "confirmed";
        await booking.save();

        const updatedBooking =
            await bookingModel
                .findById(booking._id)
                .populate("userId")
                .populate("vehicleId")
                .populate("serviceId")
                .populate("mechanicId");

        res.status(200).json({
            message: "Mechanic assigned successfully",
            booking: updatedBooking
        });
    } 
    catch (err) {
        console.error( "Assign Mechanic To Booking Error:", err );
        res.status(500).json({
            message: "Error assigning mechanic",
            error: err.message
        });
    }
};


const assignMechanicToService = async (req, res) => {
    try {
        const { id } = req.params;
        const { mechanicId } = req.body;
        if (!mechanicId) {
            return res.status(400).json({
                message:
                    "Mechanic ID is required"
            });
        }
        const mechanic = await mechanicModel.findById( mechanicId );
        if (!mechanic) {
            return res.status(404).json({
                message: "Mechanic not found"
            });
        }
        const service = await serviceModel.findById(id);
        if (!service) {
            return res.status(404).json({
                message: "Service not found"
            });
        }
        service.mechanicId = mechanicId;
        await service.save();

        const updatedService =
            await serviceModel
                .findById(service._id)
                .populate({
                    path: "mechanicId",
                    model: "Mechanic"
                });
        res.status(200).json({
            message: "Mechanic assigned to service successfully",
            service: updatedService
        });
    }
    catch (err) {
        console.error( "Assign Mechanic To Service Error:", err );
        res.status(500).json({
            message: "Error assigning mechanic to service",
            error: err.message
        });
    }
};

const getAssignedMechanics = async (req, res) => {
    try {
        const bookings = await bookingModel
                .find({
                    mechanicId: { $ne: null }
                })
                .populate("userId")
                .populate("vehicleId")
                .populate("serviceId")
                .populate({
                    path: "mechanicId",
                    model: "User"
                })
                .sort({ createdAt: -1 });

        const assignedServices = await serviceModel
                .find({
                    mechanicId: { $ne: null }
                })
                .populate({
                    path: "mechanicId",
                    model: "Mechanic"
                });
        
        const services =
            assignedServices.map( 
                (service) => {
                    const booking =
                        bookings.find(
                            (item) => {
                                const serviceId = item.serviceId?._id ?.toString();
                                const currentServiceId = service._id ?.toString();
                                return (
                                    serviceId &&
                                    currentServiceId &&
                                    serviceId ===
                                    currentServiceId
                                );
                            }
                        );
                    const serviceMechanic = service.mechanicId;
                    const bookingMechanic = booking?.mechanicId;
                    const mechanic = serviceMechanic || bookingMechanic || null;
                    return {
                        _id: booking?._id || service._id,
                        serviceId: booking?.serviceId || service._id,
                        serviceName: service.serviceName || service.name || booking?.serviceId?.name || "Service",
                        description: service.description || booking?.description || "",
                        price: service.price ?? booking?.serviceId?.price ?? 0,
                        duration: service.duration || booking?.serviceId?.duration || "N/A",
                        createdAt: booking?.createdAt || service.createdAt,
                        updatedAt: booking?.updatedAt || service.updatedAt,
                        status: booking?.status || "pending",
                        bookingStatus: booking?.status || "pending",
                        userId: booking?.userId || null,
                        customerId: booking?.userId || null,
                        vehicleId: booking?.vehicleId || null,
                        mechanicId: mechanic,
                        mechanicStatus: mechanic?.status || "Inactive",
                        bookingId: booking?._id || null,
                        bookingDate: booking?.bookingDate || null,
                        bookingTime: booking?.bookingTime || null
                    };
                }
            );
        bookings.forEach(
            (booking) => {
                const alreadyExists =
                    services.some(
                        (service) => {
                            return ( service.bookingId ?.toString() === booking._id ?.toString() );
                        }
                    );
                if (!alreadyExists) {
                    services.push({
                        _id: booking._id,
                        serviceId: booking.serviceId || null,
                        serviceName: booking.serviceId?.name || booking.serviceId?.serviceName || "Service",
                        description: booking.description || "",
                        price: booking.serviceId?.price || 0,
                        duration: booking.serviceId?.duration || "N/A",
                        createdAt: booking.createdAt,
                        updatedAt: booking.updatedAt,
                        status: booking.status || "pending",
                        bookingStatus: booking.status || "pending",
                        userId: booking.userId || null,
                        customerId: booking.userId || null,
                        vehicleId: booking.vehicleId || null,
                        mechanicId: booking.mechanicId || null,
                        mechanicStatus: booking.mechanicId?.status || "Inactive",
                        bookingId: booking._id,
                        bookingDate: booking.bookingDate || null,
                        bookingTime: booking.bookingTime || null
                    });
                }
            }
        );
        services.sort(
            (a, b) => {
                const dateA = new Date( a.updatedAt || a.createdAt || 0 );
                const dateB = new Date( b.updatedAt || b.createdAt || 0 );
                return dateB - dateA;
            }
        );
        res.status(200).json({
            message: "Assigned Mechanics Fetched Successfully", services
        });
    } 
    catch (err) {
        console.error( "Get Assigned Mechanics Error:", err );
        res.status(500).json({
            message: "Error fetching assigned mechanics",
            error: err.message
        });
    }
};

const getAllMechanics = async (req, res) => {
    try {
        const mechanics = await mechanicModel
                .find()
                .sort({ createdAt: -1 });
        res.status(200).json({
            message: "All Mechanics Retrieved Successfully",
            mechanics
        });
    } 
    catch (error) {
        console.error( "Get Mechanics Error:", error );
        res.status(500).json({
            message: "Error retrieving mechanics",
            error: error.message
        });
    }
};

const getAllServices = async (req, res) => {
    try {
        const services = await serviceModel
                .find()
                .populate({
                    path: "mechanicId",
                    model: "Mechanic"
                })
                .sort({ createdAt: -1 });
        res.status(200).json({
            message: "All Services Retrieved Successfully", services
        });
    } 
    catch (error) {
        console.error( "Get Services Error:", error );
        res.status(500).json({
            message: "Error retrieving services",
            error: error.message
        });
    }
};
const revenueAnalytics = async (req, res) => {

    try {

        // =====================================================
        // ONLY PAID + COMPLETED BOOKINGS COUNT AS REVENUE
        // =====================================================

        const paidBookings = await bookingModel

            .find({
                status: "Completed",
                paymentStatus: "paid"
            })

            .populate("serviceId");


        // =====================================================
        // CALCULATE TOTAL REVENUE
        // =====================================================

        let totalRevenue = 0;


        paidBookings.forEach((booking) => {

            const price =
                Number(
                    booking.serviceId?.price || 0
                );


            totalRevenue += price;

        });


        // =====================================================
        // COMPLETED + PAID BOOKINGS
        // =====================================================

        const totalCompletedBookings =
            paidBookings.length;


        // =====================================================
        // AVERAGE REVENUE
        // =====================================================

        const averageRevenue =
            totalCompletedBookings > 0
                ? totalRevenue / totalCompletedBookings
                : 0;


        // =====================================================
        // RESPONSE
        // =====================================================

        res.status(200).json({

            message:
                "Revenue Analytics Fetched Successfully",

            data: {

                totalRevenue,

                totalCompletedBookings,

                averageRevenue

            }

        });


    } catch (error) {

        console.error(
            "Revenue Analytics Error:",
            error
        );


        res.status(500).json({

            message:
                "Error fetching revenue analytics",

            error: error.message

        });

    }

};

module.exports = {
    dashboard,
    assignMechanic,
    assignMechanicToService,
    getAssignedMechanics,
    getAllMechanics,
    getAllCustomers,
    getAllServices,
    revenueAnalytics
};