const jwt=require("jsonwebtoken");
const authMiddleware=(req,res,next)=>{
    try{
        const token = req.headers.authorization;
        if(!token){
            return res.status(401).json({
                message:"Token Not Found"
            });
        }
        const verifyToken=jwt.verify(
            token.split(" ")[1],
            process.env.JWT_SECRET
        )
        req.user=verifyToken;
        next();
    }
    catch(err){
        res.status(500).json({
            message:"Invalid Token",
            error:err.message
        })
    }
}
module.exports = authMiddleware;