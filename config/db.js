const mongoose = require("mongoose");

 connectWithDb =async ()=>{
     try{
    await mongoose.connect(process.env.DB_URL);
    console.log("Successful connection to db");
     }
     catch(e) {
         console.error("DB connection issues");
         console.log(e);
         process.exit();
     }
}



module.exports = connectWithDb;