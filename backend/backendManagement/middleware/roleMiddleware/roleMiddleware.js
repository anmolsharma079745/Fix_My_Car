//allowed role jo hum route mai role pass karenge vo aur req.user.role jo authenticate hone ke baad authmiddleware se aiyega vo
const roleMiddleware=(...allowedRoles)=>{
    return (req,res,next)=>{
        try{
            if(!req.user){
                return res.status(401).json({
                    message: "User Not Authenticated"
                });
            }
            if(!allowedRoles.includes(req.user.role)){
                return res.status(403).json({
                    message: "Access Denied! You don't have permission"
                });
            }
            next();
        }
        catch(err){
            res.status(500).json({
                message:"Internal Server Error",
                error:err.message
            })
        }
    }
}
module.exports = roleMiddleware;