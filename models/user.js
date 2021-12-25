const mongoose = require("mongoose");
const validator = require('validator');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
var crypto = require("crypto");


const userSchema = new mongoose.Schema({

  
    name : {
        type : String,
        required:[true,"Please provide a name"],
        maxlength:[40, "Name should be under 40 characters"]
    },

    email : {
        type : String,
        required:[true,"Please provide an email"],
        validate:[validator.isEmail, 'Please Enter email in correct format'],
        unique:true,

    },
    phone: {
        type: Number ,
        required: [true,"Please provide a phone number"],
},

    password : {
        type : String,
        required:[true,"Please provide an password"],
        minLength :[8,"Password should be atleast 8 characters"],
        select : false
    },


    forgotPasswordToken:{
        type: String,

    },

    forgotPasswordExpiry : Date,
    
    verified : {
        type : Boolean,
        default: false
    },

    verificationString : {
        type:String
    },

    createdAt :{
        type: Date,
        default: Date.now
    }

})

//encrypt password before save 

userSchema.pre('save',async function(next){
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
})

// validate password with passed on user password

userSchema.methods.isValidPassword = async function(userSentPassword){
    return await bcrypt.compare(userSentPassword,this.password);
}

//create and return jwt tokens

userSchema.methods.getJwtToken = function(){
    return jwt.sign({id: this._id} , process.env.JWT_SECRET , {
        expiresIn: process.env.JWT_EXPIRY
    })
}

//generate forgot password token (string)

userSchema.methods.getForgotPasswordToken = function (){
    const forgotToken = crypto.randomBytes(20).toString('hex');

    //getting a hash - make sure to get a hash on database
    this.forgotPasswordToken = crypto.createHash('sha256').update(forgotToken).digest('hex')
    
    //time of token expiry
    this.forgotPasswordExpiry = Date.now() + 20 * 60 * 100;


    return forgotToken;
}

module.exports = mongoose.model("User",userSchema);