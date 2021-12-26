const User =  require('../models/user');
const cookieToken = require("../utils/cookieToken")
const Mailer = require("../utils/emailHelper");
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose')
var ObjectID = require('bson').ObjectID;

var id  = new ObjectID();




//Sign up controller handling signup logic

exports.signup = async (req,res,next)=>{
    const { name , email , password ,phone} = req.body;
    const verificationString = uuidv4();

    const existingUser = await User.findOne({email:email});
    console.log(existingUser);

    if(existingUser){
        return res.status(401).send({message: "User already exists"});
    }
    else{
        const user = await User.create({
            email,
            password,
            name,
            phone,
            verificationString

        })
        console.log("Sending Verification Mail to " + user.email);
        await Mailer.emailer(`Registration verification`, `Please click this verification link to complete the registeration process `+ `<a href="https://ctf-backend-api.herokuapp.com/api/v1/verify?verificationString=${user.verificationString}"\>Verify</a>`, user);
        res.status(200).json({"message":"Verification email sent. Please verify your Email to complete the registeration process"});

        next();



    }



    }  


exports.verifyRegisteration = async (req,res,next) =>{

    User.findOne({ verificationString: req.query.verificationString },  async function (err, user) {
        
        if(user) {
                id = id.toString();
                let doc = await User.findOneAndUpdate({verificationString:user.verificationString}, { verified:true});

                user.save( function (error,user) {        
                        if(error) 
                                throw error;
                        res.status(200).send({ message: "Registeration process completed. Your account has been successfully verified. Login to Continue."});
                        console.log("User " + user.email + " verified");
                        next();
                });
        }
        else {
                return res.status(401).send({ message: "Bad Link"});
        }
    }
);

}



       


// Login controller handling login logic
exports.login = async (req,res,next)=>{
   
    const {email , password} = req.body;

    if( !password || !email){
        return res.status(400).json({ "message": "Email and password required." });
    }
    const user = await User.findOne({email}).select("+password");
    if(!user){
        return res.status(401).json({ message: "User doesnot exist. Register to proceed." });
    }
    if (!user.verified){
        return res.status(401).json({ message: "Registeration process not completed. Please check your mail to complete the registeration" });
    }
    
    const isCorrectPassword = await user.isValidPassword(password);
    if(!isCorrectPassword){
        return res.status(400).send({ message: "Incorrect Password , Please Input The correct password" });
    }
    cookieToken(user,res);
}




// Logut controller handling logout logic
exports.logout = async (req,res,next)=>{
console.log(res.cookie);
    res.cookie("token" , null, {expires : new Date(Date.now())});
    
    res.status(200).json({
        success:true,
        message:"Log out successful",
        httpOnly:true
    })
}


/*
// Logut controller handling forgot password logic
exports.forgotPassword = BigPromise(async (req,res,next)=>{

    const {email } = req.body;
    const user = await User.findOne({email})

    if(!user){
        return next(new CustomError("User does not exist",400));
    }

    const forgotPasswordToken = user.getForgotPasswordToken();

    await user.save({validateBeforeSave : false});
    const myURL = `${req.protocol}://{req.get("host")}/password/reset/${forgotToken}`
    const message = `Goto this url ${myURL}`;

    try 
    {
        await emailHelper({
            email : user.email,
            subject: "Password reset mail",
            message
        })

    }
    catch(e){
        user.forgotPasswordToken = undefined;
        user.forgotPasswordExpiry = undefined
        await user.save({validateBeforeSave : false});
        return next(new CustomError(e.message , 500));
    }
})

// Reset password
exports.resetPassword = BigPromise(async (req,res,next)=>{
    const token = req.params.token;
    const encryToken = crypto.createHash('sha256').update(token).digest('hex')
    const user = await User.findOne({encryToken,
        forgotPasswordExpiry : {$gt :Date.now()}
    });

    if(!user){
        return next(new CustomError("Token is invalid or expired"));
    }

    if(req.body.password !== req.body.confirmPassword ){
        return next(new CustomError("Passwords do not match",400));
    }

    user.password = req.body.password;
    user.forgotPasswordExpiry = undefined
    user.forgotPasswordToken = undefined
    await user.save();
    cookieToken(user,res);
})


*/