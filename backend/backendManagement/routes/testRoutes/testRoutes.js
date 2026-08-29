const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware/authMiddleware");
router.get("/profile", authMiddleware, (req, res)=>{
    res.status(200).json({
        message:"Profile Access Successfully",
        user:req.user
    });
});
module.exports = router;