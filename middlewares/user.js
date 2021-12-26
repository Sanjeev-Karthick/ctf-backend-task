const { JsonWebTokenError } = require("jsonwebtoken");
const User = require("../models/user");
const jwt = require("jsonwebtoken")



exports.isLoggedin = async( req , res , next)=>{
    const token = req.cookies.token ;

    if(!token){
        return res.status(400).json({"message":"Login to perform this operation."});
    }

    const decoded = jwt.verify(token,process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id);
    next();
    

}