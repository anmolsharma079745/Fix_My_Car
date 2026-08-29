const vehicleModel = require("../../models/vehicleModel/vehicleModel");
const cloudinary = require("../../config/cloudinary");


// =====================================================
// ADD VEHICLE
// =====================================================

const addVehicle = async (req, res) => {
    try {

        const {
            vehicleName,
            model,
            numberPlate,
            vehicleType
        } = req.body;

        let vehicleImage = "";

        // =====================================================
        // UPLOAD IMAGE TO CLOUDINARY
        // =====================================================

        if (req.file) {

            const result = await new Promise((resolve, reject) => {

                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: "fix-my-ride/vehicles"
                    },
                    (error, result) => {

                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }

                    }
                );

                uploadStream.end(req.file.buffer);
            });

            vehicleImage = result.secure_url;
        }


        // =====================================================
        // CREATE VEHICLE
        // =====================================================

        const vehicle = await vehicleModel.create({
            userId: req.user.id,
            vehicleName,
            model,
            numberPlate,
            vehicleType,
            vehicleImage
        });


        res.status(201).json({
            message: "Vehicle Added Successfully",
            vehicle
        });

    } catch (err) {

        res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });

    }
};


// =====================================================
// GET CUSTOMER VEHICLES
// =====================================================

const getVehicles = async (req, res) => {
    try {

        const vehicles = await vehicleModel.find({
            userId: req.user.id
        });

        res.status(200).json({
            message: "Vehicles Fetched Successfully",
            vehicles
        });

    } catch (err) {

        res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });

    }
};


// =====================================================
// UPDATE VEHICLE
// =====================================================

const updateVehicle = async (req, res) => {
    try {

        const { id } = req.params;

        const updateData = {
            ...req.body
        };


        // =====================================================
        // UPLOAD NEW IMAGE
        // =====================================================

        if (req.file) {

            const result = await new Promise((resolve, reject) => {

                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: "fix-my-ride/vehicles"
                    },
                    (error, result) => {

                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }

                    }
                );

                uploadStream.end(req.file.buffer);
            });

            updateData.vehicleImage = result.secure_url;
        }


        const vehicle = await vehicleModel.findOneAndUpdate(
            {
                _id: id,
                userId: req.user.id
            },
            updateData,
            {
                new: true,
                runValidators: true
            }
        );


        if (!vehicle) {

            return res.status(404).json({
                message: "Vehicle Not Found"
            });

        }


        res.status(200).json({
            message: "Vehicle Updated Successfully",
            vehicle
        });

    } catch (err) {

        res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });

    }
};


// =====================================================
// DELETE VEHICLE
// =====================================================

const deleteVehicle = async (req, res) => {
    try {

        const { id } = req.params;

        const vehicle = await vehicleModel.findOneAndDelete({
            _id: id,
            userId: req.user.id
        });

        if (!vehicle) {

            return res.status(404).json({
                message: "Vehicle Not Found"
            });

        }

        res.status(200).json({
            message: "Vehicle Deleted Successfully",
            vehicle
        });

    } catch (err) {

        res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });

    }
};


module.exports = {
    addVehicle,
    getVehicles,
    updateVehicle,
    deleteVehicle
};