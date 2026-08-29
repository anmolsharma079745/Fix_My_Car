const mongoose = require("mongoose");

const serviceModel =
    require("../../models/serviceModel/serviceModel");

const mechanicModel =
    require("../../models/mechanicModel/mechanicModel");


// =====================================================
// ALLOWED VEHICLE TYPES
// =====================================================

const allowedVehicleTypes = [
    "Car",
    "Bike"
];


// =====================================================
// CREATE SERVICE - ADMIN
// =====================================================

const createService = async (req, res) => {

    try {

        const {
            serviceName,
            description,
            price,
            duration,
            vehicleType,
            mechanicId
        } = req.body;


        // =================================================
        // VALIDATION
        // =================================================

        if (
            !serviceName ||
            !description ||
            price === undefined ||
            price === null ||
            duration === undefined ||
            duration === null ||
            duration === "" ||
            !vehicleType
        ) {

            return res.status(400).json({

                message:
                    "Please provide all service details."

            });

        }


        // =================================================
        // VALIDATE VEHICLE TYPE
        // =================================================

        if (
            !allowedVehicleTypes.includes(
                vehicleType
            )
        ) {

            return res.status(400).json({

                message:
                    "Vehicle type must be Car or Bike.",

                allowedVehicleTypes

            });

        }


        // =================================================
        // VALIDATE PRICE
        // =================================================

        if (
            typeof price !== "number" ||
            price < 0
        ) {

            return res.status(400).json({

                message:
                    "Price must be a valid positive number."

            });

        }


        // =================================================
        // VALIDATE MECHANIC IF PROVIDED
        // =================================================

        if (mechanicId) {

            if (
                !mongoose.Types.ObjectId.isValid(
                    mechanicId
                )
            ) {

                return res.status(400).json({

                    message:
                        "Invalid mechanic ID."

                });

            }


            const mechanic =
                await mechanicModel.findById(
                    mechanicId
                );


            if (!mechanic) {

                return res.status(404).json({

                    message:
                        "Mechanic not found."

                });

            }


            // =================================================
            // INACTIVE MECHANIC CHECK
            // =================================================

            if (
                mechanic.status === "Inactive"
            ) {

                return res.status(400).json({

                    message:
                        "Inactive mechanic cannot be assigned."

                });

            }

        }


        // =================================================
        // CREATE SERVICE
        // =================================================

        const service =
            await serviceModel.create({

                serviceName,

                description,

                price,

                duration,

                vehicleType,

                mechanicId:
                    mechanicId || null

            });


        // =================================================
        // POPULATE MECHANIC
        // =================================================

        await service.populate(

            "mechanicId",

            "name email phone specialization experience status"

        );


        // =================================================
        // RESPONSE
        // =================================================

        res.status(201).json({

            message:
                "Service Created Successfully",

            service

        });

    }

    catch (err) {

        console.error(
            "Create Service Error:",
            err
        );


        res.status(500).json({

            message:
                "Internal Server Error",

            error:
                err.message

        });

    }

};



// =====================================================
// GET ALL SERVICES
// =====================================================

const getServices = async (req, res) => {

    try {

        const services =
            await serviceModel

                .find()

                .populate(

                    "mechanicId",

                    "name email phone specialization experience status"

                )

                .sort({

                    createdAt: -1

                });


        res.status(200).json({

            message:
                "Services Fetched Successfully",

            services

        });

    }

    catch (err) {

        console.error(
            "Get Services Error:",
            err
        );


        res.status(500).json({

            message:
                "Internal Server Error",

            error:
                err.message

        });

    }

};



// =====================================================
// UPDATE SERVICE - ADMIN
// =====================================================

const updateService = async (req, res) => {

    try {

        const {
            serviceName,
            description,
            price,
            duration,
            vehicleType,
            mechanicId
        } = req.body;


        // =================================================
        // VALIDATION
        // =================================================

        if (
            !serviceName ||
            !description ||
            price === undefined ||
            price === null ||
            duration === undefined ||
            duration === null ||
            duration === "" ||
            !vehicleType
        ) {

            return res.status(400).json({

                message:
                    "Please provide all service details."

            });

        }


        // =================================================
        // VALIDATE VEHICLE TYPE
        // =================================================

        if (
            !allowedVehicleTypes.includes(
                vehicleType
            )
        ) {

            return res.status(400).json({

                message:
                    "Vehicle type must be Car or Bike.",

                allowedVehicleTypes

            });

        }


        // =================================================
        // VALIDATE PRICE
        // =================================================

        if (
            typeof price !== "number" ||
            price < 0
        ) {

            return res.status(400).json({

                message:
                    "Price must be a valid positive number."

            });

        }


        // =================================================
        // VALIDATE MECHANIC IF PROVIDED
        // =================================================

        if (mechanicId) {

            if (
                !mongoose.Types.ObjectId.isValid(
                    mechanicId
                )
            ) {

                return res.status(400).json({

                    message:
                        "Invalid mechanic ID."

                });

            }


            const mechanic =
                await mechanicModel.findById(
                    mechanicId
                );


            if (!mechanic) {

                return res.status(404).json({

                    message:
                        "Mechanic not found."

                });

            }


            // =================================================
            // INACTIVE MECHANIC CHECK
            // =================================================

            if (
                mechanic.status === "Inactive"
            ) {

                return res.status(400).json({

                    message:
                        "Inactive mechanic cannot be assigned."

                });

            }

        }


        // =================================================
        // UPDATE SERVICE
        // =================================================

        const service =
            await serviceModel.findByIdAndUpdate(

                req.params.id,

                {

                    serviceName,

                    description,

                    price,

                    duration,

                    vehicleType,

                    mechanicId:
                        mechanicId || null

                },

                {

                    new: true,

                    runValidators: true

                }

            );


        // =================================================
        // SERVICE NOT FOUND
        // =================================================

        if (!service) {

            return res.status(404).json({

                message:
                    "Service Not Found"

            });

        }


        // =================================================
        // POPULATE MECHANIC
        // =================================================

        await service.populate(

            "mechanicId",

            "name email phone specialization experience status"

        );


        // =================================================
        // RESPONSE
        // =================================================

        res.status(200).json({

            message:
                "Service Updated Successfully",

            service

        });

    }

    catch (err) {

        console.error(

            "Update Service Error:",

            err

        );


        res.status(500).json({

            message:
                "Internal Server Error",

            error:
                err.message

        });

    }

};



// =====================================================
// DELETE SERVICE - ADMIN
// =====================================================

const deleteService = async (req, res) => {

    try {

        const service =
            await serviceModel.findByIdAndDelete(

                req.params.id

            );


        // =================================================
        // SERVICE NOT FOUND
        // =================================================

        if (!service) {

            return res.status(404).json({

                message:
                    "Service Not Found"

            });

        }


        // =================================================
        // RESPONSE
        // =================================================

        res.status(200).json({

            message:
                "Service Deleted Successfully",

            service

        });

    }

    catch (err) {

        console.error(

            "Delete Service Error:",

            err

        );


        res.status(500).json({

            message:
                "Internal Server Error",

            error:
                err.message

        });

    }

};



// =====================================================
// EXPORT
// =====================================================

module.exports = {

    createService,

    getServices,

    updateService,

    deleteService

};