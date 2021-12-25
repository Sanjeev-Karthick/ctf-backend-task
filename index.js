const express = require('express');
const app = express();
const connectWithDb = require('./config/db');
require("dotenv").config();
const cookieParser = require("cookie-parser");





//connect with database 
connectWithDb();

//essential middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// swagger documentation requirements
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

// cookies middleware 
app.use(cookieParser());

// swagger documentation middleware
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/",(req,res)=>{ 
    res.send("Helooo");
})

// import all routes 

const user = require("./routes/user");
const product = require('./routes/product');

//router middleware

app.use("/api/v1",user);
app.use("/api/v1/product",product);

app.listen(4000,()=>{
    console.log("Server running at PORT 4000")
})






