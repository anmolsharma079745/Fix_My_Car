const userModel = require("../../models/userModel/userModel");
const bookingModel = require("../../models/bookingModel/bookingModel");


// =====================================================
// GET PUBLIC HOME PAGE STATISTICS
// =====================================================

const getPublicStatistics = async (req, res) => {

    try {

        // =================================================
        // TOTAL CUSTOMERS
        // =================================================

        const totalCustomers = await userModel.countDocuments({
            role: "customer"
        });


        // =================================================
        // COMPLETED SERVICES
        // =================================================

        const completedServices = await bookingModel.countDocuments({
            status: "Completed"
        });


        // =================================================
        // VERIFIED / REGISTERED MECHANICS
        // =================================================

        const totalMechanics = await userModel.countDocuments({
            role: "mechanic"
        });


        // =================================================
        // CUSTOMER SATISFACTION
        // =================================================
        // Rating / Review system abhi nahi hai,
        // isliye filhaal static rakha gaya hai.

        const customerSatisfaction = 99;


        // =================================================
        // RESPONSE
        // =================================================

        res.status(200).json({

            message: "Public statistics retrieved successfully",

            statistics: {

                customers: totalCustomers,

                completedServices: completedServices,

                mechanics: totalMechanics,

                satisfaction: customerSatisfaction

            }

        });

    }

    catch (error) {

        console.error(
            "Public Statistics Error:",
            error
        );


        res.status(500).json({

            message: "Error retrieving public statistics",

            error: error.message

        });

    }

};


module.exports = {
    getPublicStatistics
};