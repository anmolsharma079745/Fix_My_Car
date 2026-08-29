const mongoose =require("mongoose");

const vehicleSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    vehicleName: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    numberPlate: {
        type: String,
        required: true,
        unique: true
    },
    vehicleType: {
        type: String,
        required: true,
        enum: ["Car", "Bike"]
    },
    vehicleImage:{
        type: String,
        default: ""
    }
    
},
{
    timestamps: true
}
)
const vehicleModel = mongoose.model("Vehicle", vehicleSchema);

module.exports = vehicleModel;