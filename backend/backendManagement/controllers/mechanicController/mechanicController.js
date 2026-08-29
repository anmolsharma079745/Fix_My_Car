const bcrypt = require("bcrypt");

const userModel = require("../../models/userModel/userModel");
const mechanicModel = require("../../models/mechanicModel/mechanicModel");

const addMechanic = async (req, res) => {
    try {

        const {
            name,
            email,
            password,
            phone,
            specialization,
            experience
        } = req.body;


        // ==========================================
        // CHECK EMAIL
        // ==========================================

        const emailExist = await userModel.findOne({
            email: email.toLowerCase().trim()
        });

        if (emailExist) {
            return res.status(400).json({
                message: "User with this email already exists"
            });
        }


        // ==========================================
        // CHECK PHONE
        // ==========================================

        const phoneExist = await userModel.findOne({
            phone: phone.trim()
        });

        if (phoneExist) {
            return res.status(400).json({
                message: "User with this phone number already exists"
            });
        }


        // ==========================================
        // HASH PASSWORD
        // ==========================================

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );


        // ==========================================
        // CREATE USER
        // ==========================================

        const user = await userModel.create({

            name,

            email: email.toLowerCase().trim(),

            password: hashedPassword,

            phone: phone.trim(),

            role: "mechanic"

        });


        try {

            // ==========================================
            // CREATE MECHANIC
            // ==========================================

            const mechanic = await mechanicModel.create({

                userId: user._id,

                name,

                email: email.toLowerCase().trim(),

                phone: phone.trim(),

                specialization,

                experience

            });


            // ==========================================
            // SUCCESS RESPONSE
            // ==========================================

            return res.status(201).json({

                message: "Mechanic Added Successfully",

                user: {

                    _id: user._id,

                    name: user.name,

                    email: user.email,

                    phone: user.phone,

                    role: user.role

                },

                mechanic

            });


        } catch (mechanicError) {

            // ==========================================
            // ROLLBACK USER
            // ==========================================

            await userModel.findByIdAndDelete(
                user._id
            );

            throw mechanicError;
        }


    } catch (err) {

        console.error(
            "Add Mechanic Error:",
            err
        );

        res.status(500).json({

            message: "Internal Server Error",

            error: err.message

        });

    }
};

const getMechanics = async (req, res) => {
    try {
        const mechanics = await mechanicModel
            .find()
            .populate("userId", "name email phone role")
            .sort({
                createdAt: -1
            });

        res.status(200).json({
            message: "Mechanics Fetched Successfully",
            mechanics
        });

    } catch (err) {
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
};

const updateMechanic = async (req, res) => {
    try {
        const mechanic = await mechanicModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!mechanic) {
            return res.status(404).json({
                message: "Mechanic Not Found"
            });
        }

        res.status(200).json({
            message: "Mechanic Updated Successfully",
            mechanic
        });

    } catch (err) {
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
};

const deleteMechanic = async (req, res) => {
    try {
        const { id } = req.params;

        const mechanic = await mechanicModel.findById(id);

        if (!mechanic) {
            return res.status(404).json({
                message: "Mechanic Not Found"
            });
        }

        await mechanicModel.findByIdAndDelete(id);

        if (mechanic.userId) {
            await userModel.findByIdAndDelete(mechanic.userId);
        }

        res.status(200).json({
            message: "Mechanic Deleted Successfully",
            mechanic
        });

    } catch (err) {
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
};

module.exports = {
    addMechanic,
    getMechanics,
    updateMechanic,
    deleteMechanic
};