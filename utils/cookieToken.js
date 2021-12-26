module.exports = (user,res)=>{

    const options = {
        httpOnly : true,
        expiresIn: Date.now() * 24 * 3600

    }
    jwtToken = user.getJwtToken();
    user.password = undefined;
    res.cookie("token",jwtToken,options).status(200).json({
        success:true,
        jwtToken,
        user
        
    })
}